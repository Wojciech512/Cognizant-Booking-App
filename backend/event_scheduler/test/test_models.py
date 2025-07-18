from datetime import timedelta

import pytest
from django.utils import timezone
from event_scheduler.models import EventCategory, TimeSlot


@pytest.mark.django_db
class TestEventCategoryModel:
    def test_str_returns_name(self):
        cat = EventCategory.objects.create(name="Cat4")
        result = str(cat)
        assert result == "Cat4"


@pytest.mark.django_db
class TestTimeSlotModel:
    def test_str_includes_category_and_start(self):
        start = timezone.now()
        cat = EventCategory.objects.create(name="Cat5")
        ts = TimeSlot.objects.create(
            start_dt=start, end_dt=start + timedelta(hours=1), category=cat
        )
        expected = f"{cat.name} @ {start:%Y-%m-%d %H:%M}"
        result = str(ts)
        assert result == expected
