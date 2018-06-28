# Background Scripts

All of the logic working with the datastore occurs in the background scripts. Front-end pages communicate with these scripts via message ports.

## `get_account_details`

Returns the JSON for the user's account. Contains the following fields:

```
mode
uid
email
displayName
avatar
```

## `open_view`

Open the view named `name` in a new tab. Returns an empty object.

## `close_view`

Close the view named `name` if it's open. Returns an empty object.

## `initialize`

Initialize the datastore and open the view named `view`, if specified. Returns an empty object.

## `upgrade_account`

Upgrade a local account to an FxA-connected account.

## `reset`

Reset the local state and re-open the first run page. Returns an empty object.

## `signin`

Sign in to the user's Firefox Account (i.e. unlock the datastore), and open the view named `view`, if specified. Returns an empty object.

## `signout`

Sign out of the user's Firefox Account (i.e. lock the datastore), and close the management view if open. Returns an empty object.

## `list_items`

List all the items in the datastore. Returns an array of summaries of the items in the `items` field.

## `add_item`

Add an item (in the `item` attribute) to the datastore. Returns the updated item in the `item` field with its `id` field filled out.

## `update_item`

Update an existing item (in the `item` attribute) in the datastore. Returns the updated item in the `item` field.

## `remove_item`

Remove the item with ID `id` from the datastore. Returns an empty object.

## `get_item`

Fetches the item with ID `id` from the datastore. Returns the item object in the `item` field.

## `proxy_telemetry_event`

Record a telemetry event with method `method`, object `object`, and extra `extra`.
