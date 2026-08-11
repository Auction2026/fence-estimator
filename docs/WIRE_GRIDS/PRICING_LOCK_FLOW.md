
# Pricing Lock Flow

```text
Estimate reviewed
      |
      v
Manager approves
      |
      v
User clicks "Lock Price"
      |
      v
Set estimate.is_locked = true
Set estimate.locked_at = timestamp
Set estimate.locked_by = user_id
      |
      v
Freeze values for contract generation
      |
      v
Create / update contract with locked totals
      |
      v
Block direct estimate edits
      |
      v
Any scope or price change now requires Change Order
```

## Control objective
Price locking prevents silent edits to a sold estimate and creates a clear audit point for contract enforcement.
