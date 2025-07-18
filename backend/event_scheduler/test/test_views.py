import datetime
import uuid
from datetime import timedelta

import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from event_scheduler.models import EventCategory, TimeSlot
from rest_framework.test import APIClient


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def regular_user():
    return User.objects.create_user(username="user", password="pw")


@pytest.fixture
def staff_user():
    return User.objects.create_user(
        username="staff", password="pw", is_staff=True
    )


@pytest.fixture
def admin_user():
    return User.objects.create_superuser(
        username="admin", email="a@e.com", password="pw"
    )


@pytest.fixture
def category():
    return EventCategory.objects.create(name=f"Cat-{uuid.uuid4()}")


@pytest.fixture
def timeslot(category):
    return TimeSlot.objects.create(
        start_dt=timezone.now(),
        end_dt=timezone.now() + timedelta(hours=1),
        category=category,
        is_booked=False,
    )


@pytest.mark.django_db
class TestCategoryListCreateView:
    def test_get_as_authenticated(self, client, regular_user, category):
        client.force_authenticate(regular_user)
        url = reverse("categories")
        resp = client.get(url)
        assert resp.status_code == 200
        assert any(item["id"] == category.id for item in resp.data)

    def test_post_non_staff_forbidden(self, client, regular_user):
        client.force_authenticate(regular_user)
        url = reverse("categories")
        resp = client.post(
            url, {"name": f"New-{uuid.uuid4()}"}, format="json"
        )
        assert resp.status_code == 403

    def test_post_staff_creates(self, client, staff_user):
        client.force_authenticate(staff_user)
        url = reverse("categories")
        new_name = f"NewCat-{uuid.uuid4()}"
        resp = client.post(url, {"name": new_name}, format="json")
        assert resp.status_code == 201
        assert EventCategory.objects.filter(name=new_name).exists()


@pytest.mark.django_db
class TestTimeSlotListCreateView:
    def test_get_list(self, client, regular_user, timeslot):
        client.force_authenticate(regular_user)
        url = reverse("timeslot-list")
        resp = client.get(url)
        assert resp.status_code == 200
        assert isinstance(resp.data, list)

    def test_filter_by_category(self, client, regular_user, category):
        client.force_authenticate(regular_user)
        other_category = EventCategory.objects.create(
            name=f"Other-{uuid.uuid4()}"
        )
        TimeSlot.objects.create(
            start_dt=timezone.now(),
            end_dt=timezone.now() + timedelta(hours=1),
            category=other_category,
        )
        url = reverse("timeslot-list") + f"?category={category.id}"
        resp = client.get(url)
        assert all(item["category"] == str(category.id) for item in resp.data)

    def test_filter_by_date_range(self, client, regular_user, category):
        client.force_authenticate(regular_user)
        base = datetime.datetime(
            2025, 1, 1, 9, 0, tzinfo=datetime.timezone.utc
        )
        ts_in = TimeSlot.objects.create(
            start_dt=base,
            end_dt=base + timedelta(hours=1),
            category=category,
        )
        TimeSlot.objects.create(
            start_dt=base + timedelta(days=5),
            end_dt=base + timedelta(days=5, hours=1),
            category=category,
        )
        url = (
            reverse("timeslot-list")
            + "?start_date=2025-01-01&end_date=2025-01-02"
        )
        resp = client.get(url)
        assert len(resp.data) == 1
        assert resp.data[0]["id"] == str(ts_in.id)

    def test_post_non_staff_forbidden(self, client, regular_user, category):
        client.force_authenticate(regular_user)
        url = reverse("timeslot-list")
        data = {
            "start_dt": timezone.now(),
            "end_dt": timezone.now() + timedelta(hours=1),
            "category": category.id,
        }
        resp = client.post(url, data, format="json")
        assert resp.status_code == 403

    def test_post_staff_creates_and_forces_unbooked(
        self, client, staff_user, category
    ):
        client.force_authenticate(staff_user)
        url = reverse("timeslot-list")
        data = {
            "start_dt": timezone.now(),
            "end_dt": timezone.now() + timedelta(hours=1),
            "category": category.id,
            "is_booked": True,
        }
        resp = client.post(url, data, format="json")
        assert resp.status_code == 201
        ts = TimeSlot.objects.get(id=resp.data["id"])
        assert ts.is_booked is False


@pytest.mark.django_db
class TestTimeSlotDeleteView:
    def test_delete_by_regular_user_forbidden(
        self, client, regular_user, timeslot
    ):
        client.force_authenticate(regular_user)
        url = reverse("timeslot-delete", args=[timeslot.id])
        resp = client.delete(url)
        assert resp.status_code == 403

    def test_delete_by_staff_allowed(self, client, staff_user, timeslot):
        client.force_authenticate(staff_user)
        url = reverse("timeslot-delete", args=[timeslot.id])
        resp = client.delete(url)
        assert resp.status_code == 204
        assert not TimeSlot.objects.filter(id=timeslot.id).exists()

    def test_delete_unbooked_by_admin(self, client, admin_user, timeslot):
        client.force_authenticate(admin_user)
        url = reverse("timeslot-delete", args=[timeslot.id])
        resp = client.delete(url)
        assert resp.status_code == 204
        assert not TimeSlot.objects.filter(id=timeslot.id).exists()

    def test_delete_booked_by_admin_bad_request(
        self, client, admin_user, timeslot
    ):
        timeslot.is_booked = True
        timeslot.save()
        client.force_authenticate(admin_user)
        url = reverse("timeslot-delete", args=[timeslot.id])
        resp = client.delete(url)
        assert resp.status_code == 400
        assert TimeSlot.objects.filter(id=timeslot.id).exists()
