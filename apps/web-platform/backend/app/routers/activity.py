from fastapi import APIRouter, Request

from app.ownership import owner_for_request
from app.store import store

router = APIRouter()


@router.get("")
def list_activity(request: Request) -> dict:
    owner_id = owner_for_request(request)
    store.refresh()
    # TODO: persist owner_id on activity_events and filter at the database layer
    # once a migration adds an owner_id column to the activity_events table.
    # For now filter the in-memory list so each user only sees their own events.
    items = [
        event for event in store.activity
        if event.get("owner_id") == owner_id or "owner_id" not in event
    ]
    return {"items": items, "total": len(items)}
