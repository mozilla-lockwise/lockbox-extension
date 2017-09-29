# Lockbox Metrics Plan As of 9/29/17
**Note to Lockbox Engineers:** *The variable names used in this doc are just placeholders. Once I know what they will actually be I can update them.*

This is the metrics collection plan for Lockbox's alpha release. It is more of a wishlist than a plan - only some portion of what's here might actually be implemented.

Best viewed in something that can render Markdown.

## Analysis

We will aim to collect data that will help us understand the following (please add anything that you think is important, these are just the basics; note that not all these things will be answerable give the data we will have to work with during alpha):

- Do people Save Passwords in Lockbox?
    - How many? (count of items saved per user)
    - How often? (number of credentials saved per time interval)
- Do people create their own passwords or use Lockbox to generate them?
    - Ratio: (Number of times the PW generator is used when storing an item) / (number of credentials stored)
- Do people use the passwords they store on Lockbox?
    - How many times (per some unit of time) do stored credentials get auto-filled?
    - How many times do they copy a credential (e.g. to fill it in manually)
    - How many times do they reveal a credential in the CRUD editor?
- How well does does auto-filling credentials work **(not in alpha)**?
    - When credentials are auto-filled, are they filled into the correct fields?
    - How often must the user make a change to what fields were filled?
        - How to measure these things??? is there an easier way than just asking if the auto-fill didn't work?
- Do people continue to use Lockbox after first use?
    - Out of those who install, how many use it more than once?
- Where are the drop-off points in the user flow?
    - Do the majority of people make it all the way through the setup process?
    - Once initially setup, do people continue to add credentials?
    - Do people continue to auto-fill credentials after the first usage?
- What are people's opinions on LB
    - Feedback forms
- Do people sync their passwords **(not in alpha)**?
    - How does syncing affect engagement?
- Maybe: what type of sites do people use Lockbox with **(not in alpha)**?

## Collection

**Note:** *This is the collection plan for our internal alpha release. For our beta release will be taking advantage of test pilot's telemetry API. The metrics plan for beta will be described in a separate document.*

At this point, all measurements related to Lockbox will be made client-side.

For our internal alpha release, we will be making use of the public JavaScript API that allows recording and sending of event data through an add-on. **This means that for our alpha release we will only be collecting event-based data**. The API is documented here:

https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/telemetry/collection/events.html#the-api

Once the events are logged in the client they should appear in [about:telemetry](about:telemetry). From there they will be submitted in the main ping payload under `processes.dynamic.events` and available through the usual services (STMO and ATMO), as well as amplitude.

### Event Registration and Recording

The events that we will record will conform to the structure expected by the telemetry pipeline. When the events are logged in telemetry they will be a list of:

`[timestamp, category, method, object, value, extra]`

The API takes care of the timestamp for us. We just need to define `category`, `method`, `object` and `extra` (`value` is optional and we won't use it).

Because we are using the API through an add-on it **isn't** necessary that we include an events.yaml file.

Instead we will define our events by **registering** them using a call to `Services.telemetry.registerEvents(category, eventData)`.

Here's a breakdown of how a to register a typical event:


```javascript
Services.telemetry.registerEvents("event_category", {
    "event_name": {
        methods: ["click", ... ], // types of events that can occur
        objects: ["a_button", ... ], // objects event can occur on
        extra: {"key": "value", ... } // key-value pairs (strings)
    }
```

For our purposes, we will use the `extra` field for a few purposes:

-   To log the FxA user id of the client logging the event (e.g. `"fxa_uid": uid`)
-   To log the UUID of the item that has been added or changed (e.g. `"item_id": UUID`)
-   To log the fields that are modified when an item is updated in the datastore (e.g. `"fields":"password,notes"`  (because the value has to be a string we will have to concat the fields that were updated somehow)

Once an event is registered, we can record it with:

`Services.telemetry.recordEvent(category, method, object, value, extra)`

When recording, we can use `null` for `value`.

See the Events section for specific examples of event registration and recording.

## Metrics Overview

For alpha, we'd like to (ideally) like to be able to track the following general categories of things:

-   The setup flow, so we can know at what points (if any) people quit the flow before finishing it
-   Top-level interactions centered around use of the Lockbox toolbar icon. This includes interactions within the initial pop-over that is displayed when the user clicks the icon.
-   Interactions with the main CRUD editor view which lists the user's Lockbox items (credentials)
-   Interactions with the add / modify dialogs used to enter / edit item information
-   Changes to the datastore that actually contains the user's items, in addition to user actions that lead to those changes
-   When the user submits feedback about lockbox

Each of these are described below within their own Events subsection.


## Non-Event Metrics

These are the metrics we plan to collect regarding the state of user datastores. Note that we won't be able to record these directly for alpha. We will have to infer them from the event data.

-   `n_items` The number of credentials that exist in the user's datastore. Integer

-   `n_notes` The number of items for which the user has manually entered custom notes for. Integer
-   `timestamp_last` The timestamp of the last edit the user made to the datastore. Does not necessarily correspond to the last time they opened the CRUD editor.

## Events

### Setup Events

From a metrics point of view, the FxA sign-in / account creation process is a black box to us. Thus the best we can do at this point is track when a user interacts with the Lockbox-specific views that are included in the first run flow. We have two **categories** of events here: rendering events and interaction events:  `setup.render` and `setup.interaction`. For rendering events, the **object** field is populated by the name of the view being rendered; for interaction events the **object** is the name of the button. Below is a brief description of the view names and their corresponding buttons.

-   `lockbox_toolbar_firstrun`
    -   Pop-over shown when the user first clicks on the Lockbox toolbar icon after install. Contains the `signin_button`. Note that the click on the toolbar icon itself is logged in a separate event (see "Toolbar Button Interaction Event" section below).
-   `welcome`
    -   Shown after sign-in button is clicked. Contains the `fxa_login_button`
-   `confirm_master_password`
    -   Shown after FxA process is completed. Prompts user to re-use their FxA pw as their lockbox master pw. Contains the `confirm_master_pw_button`
-   `done`
    -   Final view in setup flow. Contains `open_button` that opens the item editor.



The **methods** for these events are `render` and `click` for rendering and interaction events, respectively.


The **extra** field contains the user's FxA anonymous/random user id. For `lockbox_toolbar_firstrun` and `welcome` views this will be `null`.


To register the rendering events:
```javascript
Services.telemetry.registerEvents("setup.render", {
  "setup.render": {
    methods: ["render"],
    objects: ["lockbox_toolbar_firstrun", // startup flow views
            "welcome",
            "confirm_master_password",
            "done"],
    extra: {"fxa_uid": uid} // value is null in some cases, see above
  }
});
```
To register the interaction events:
```javascript
Services.telemetry.registerEvents("setup.interaction", {
  "setup.click": {
    methods: ["click"],
    objects: ["signin_button", // start-up flow buttons
              "fxa_login_button",
              "confirm_master_pw_button",
              "open_button"],
    extra: {"fxa_uid": uid} // value is null in some cases, see above
  }
});
```
An example of how to record a rendering of the `done` view:
```javascript
Services.telemetry.recordEvent("setup.render",
                    "render",
                    "done",
                    null,
                    {"fxa_uid": uid} ) // user has signed in by now);
```                    


To record (for example) a click on one of the buttons:

```javascript
Services.telemetry.recordEvent("lockbox_toolbar_firstrun.interaction",
                    "click",
                    "signin_button",
                    null,
                    {"fxa_uid": null} ) // user hasn't signed in yet);
```                    
### Toolbar Button Interaction Event
At this stage of development, the Lockbox toolbar icon is the main entrypoint for using the Lockbox UI. There is only one event of concern here, a click on the icon. This event has its own **category** of `toolbar.interaction`. The **method** is click, and the object is **toolbar_button**.

The event can be registered as follows:

```javascript
Services.telemetry.registerEvents("toolbar.interaction", {
  "toolbar.click": {
    methods: ["click"],
    objects: ["toolbar_button"],
    extra: {"fxa_uid": uid}
  }
});
```
To record the event:
```javascript
Services.telemetry.recordEvent("toolbar.interaction",
                    "click",
                    "toolbar_button",
                    null,
                    {"fxa_uid": uid});
```

### Item list Interaction Events
These events relate to interactions with the item list rendered after a click of the Lockbox toolbar button. These events assume that the user has already logged in with FxA. For events related to the setup flow, see the section above.

Immediately after setup there will be no items in the datastore. As long as this is the case, the item list will only provide a single button to add a new entry:



As long as there is at least one entry in the datastore, the item list will be displayed:



Importantly, the UI elements above can be displayed in one of two containers: the pop over (above) and a “full blown” editor that is contained within its own tab. As of now, the two containers contain the same functionality and layout. However, because we would like to know which container people prefer to use, we will log events within each of them separately. Thus we will have two categories of events related to the item list: `pop_list.interaction` and `tab_list.interaction`. They will be recorded as `pop_list.click` and `tab_list.click`.

The only possible **method** is `click`.

The **objects** are `item_button` (the clickable area of an entry in the item list), `feedback_button`, `add_first_button` (only displayed if there are no items in the datastore), `add_new_button` (available so long as there at least one item in the datastore), `search_box` and `sign_out_button`.


To register these events we would use code like the following. Substitute `pop_list` for `tab_list` to register the events for the full tab container instead of the pop-over container.


```javascript
Services.telemetry.registerEvents("pop_list.interaction", {
  "pop_list.click": {
    methods: ["click"],
    objects: ["item_button",
        "feedback_button",
        "add_first_button",
        "add_new_button",
        "search_box",
        "sign_out_button"],
    extra: {"fxa_uid": uid}
  }
});
```

To record (for example) a click on the add new entry button:
```javascript
Services.telemetry.recordEvent("pop_list.interaction",
                    "click",
                    "add_new_button",
                    null,
                    {"fxa_uid": uid});
```

### Item View Interaction Events
When a user clicks on an item from the item list, they will be directed to the item view. We will log clicks on each of the five buttons in this view (also the **objects** used in the event): `edit_entry_button`, `show_password_button`, `copy_password_button`, `copy_username_button` and `back_button`.



The event **category** is `item_view.interaction` and the event is recorded as `item_view.click`.

The **method** is `click`.

Example event registration:

```javascript
Services.telemetry.registerEvents("item_view.interaction", {
  "item_view.click": {
    methods: ["click"],
    objects: ["edit_entry_button",
        "show_password_button",
        "copy_password_button",
        "copy_username_button",
    "back_button"],
    extra: {"fxa_uid": uid}
  }
});
```
Example of recording a click to show password event:

```javascript
Services.telemetry.recordEvent("item_view.interaction",
                    "click",
                    "show_password_button",
                    null,
                    {"fxa_uid": uid});
```

### Events Related to Interactions in the Item Editor(s)
These events record actions users take in the item editors. For events related to the submission of actual item information, see the next section. The item editor has 5 fields: `title_field`, `origin_field` (URL for the credential), `username_field`, `password_field`, and `notes_field`. There are also three buttons: `save_entry_button`, `cancel_button`, and `toggle_password_button`. The latter toggles the visibility of characters in the password field.  



The event **category** is `item_editor.interaction` and the event is recorded as `item_editor.click`.

The **methods** are `click` and `focus`.

Example event registration:

```javascript
Services.telemetry.registerEvents("item_editor.interaction", {
  "item_editor.click": {
    methods: ["click", "focus"],
    objects: ["title_field",
        "origin_field",
        "username_field",
        "password_field",
        "notes_field",
        "save_entry_button",
        "cancel_button",
        "toggle_password_button"],
    extra: {"fxa_uid": uid}
  }
});
```

Example of recording a click on the `save_entry_button`:

```javascript
Services.telemetry.recordEvent("item_editor.interaction",
                    "click",
                    "save_entry_button",
                    null,
                    {"fxa_uid": uid});
```

### Events Related to Submitting An Item Change from the Item Editor(s)
Events of **category** `item_change_submitted` record the actual submission of new item information to the datastore (either completely new entries or updates to existing items).


In theory, these should be tied to equivalent events in the datastore, so that (for example) an `adding` event which is logged when a user submits a new item has a corresponding `added` event that gets logged when the item is successfully added to the datastore. This may need to change, but for simplicity's sake I've made it as close to the datastore events as possible (see next section). These events will be recorded as `item_change_submitted`.

**Methods** for this event are `adding`, `updating` and `deleting`.

The **object** can be `add_form` or `update_form`.

The **extra** field contains the item's UUID *for updating and deleting events only*. For adding events, it always contains the string "new".

To register these events, we would do something like:
```javascript
Services.telemetry.registerEvents("item_change_submitted", {
  "item_change_submitted": {
    methods: ["adding","updating","deleting"],
    objects: ["add_form","edit_form"],
    extra: {"fxa_uid": uid,
            "item_id": UUID}
  }
});
```

To record a new item submission (note the `item_id` is "new"):
```javascript
Services.telemetry.recordEvent("item_change_submitted",
                    "added",
                    "add_form",
                    null,
                    {"fxa_uid": uid,
                    "item_id": "new"});
```

### Events Related to Changes in the Datastore
We will record an event of **category** `datastore.changed` when there is a change to the datastore. These events will be recorded as `entry_changed`.

**Methods** for this event are `added`, `updated` and `deleted`.

The **object** field is always `datastore`.

The **extra** field contains the item's (hashed) UUID. This will allow us to track changes to an item over its lifetime. When the method is `updated`, this field also includes a list indicating which fields in the credential were updated.

To register these events, we would do something like:
```javascript
Services.telemetry.registerEvents("datastore.changed", {
  "entry_changed": {
    methods: ["added","updated","deleted"],
    objects: ["datastore"],
    extra: { "fxa_uid": uid,
    "item_id": UUID,
    "fields": "title,origin,username,password,notes" }  }
});
```

An example of logging an item update in the datastore:
```javascript
Services.telemetry.recordEvent("database.changed",
                    "updated",
                    "datastore",
                    null,
                    {"fxa_uid": uid,
                    "item_id": UUID,
                    "fields": "username,password"});
```

### Feedback Events

When the user enters the feedback form through the toolbar pop-over, we will record an event when a user submits feedback. Note that this will *not* contain the feedback itself: that is logged elsewhere (not thru telemetry).


```javascript
Services.telemetry.registerEvents("feedback.interaction", {
  "feedback_submit.click": {
    methods: ["click"],
    objects: ["submit_button"],
    extra: {"fxa_uid": uid}
  }
});
```
To record (for example) a click of the toolbar:
```javascript
Services.telemetry.recordEvent("top_level.interaction",
                    "click",
                    "toolbar",
                    null,
                    {"fxa_uid": uid});
```                    

### Fill Events: TBD
This section will describe the events related to auto-filling login credentials on web forms using items from the datastore. Since this isn't invented yet, its empty.

---

## References

Docs for the Public JS API that allows us to log events thru an add-on:

https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/telemetry/collection/events.html#the-api
