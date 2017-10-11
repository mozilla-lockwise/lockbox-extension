# Lockbox Metrics Plan

_Last Updated: October 9, 2017_

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [TL;DR Metrics Implemented for Alpha Thus Far](#tldr-metrics-implemented-for-alpha-thus-far)
- [Analysis](#analysis)
- [Collection](#collection)
	- [Event Registration and Recording](#event-registration-and-recording)
- [Metrics Overview](#metrics-overview)
- [Non-Event Metrics](#non-event-metrics)
- [!!!!!!! EVERYTHING BELOW HERE IS OLD AND OUT OF DATE NOT IMPLEMENTED KEPT HERE FOR FUTURE REFERENCE ONLY !!!!!!!](#-everything-below-here-is-old-and-out-of-date-not-implemented-kept-here-for-future-reference-only-)
	- [Setup Events](#setup-events)
	- [Item list Interaction Events](#item-list-interaction-events)
	- [Item View Interaction Events](#item-view-interaction-events)
	- [Events Related to Interactions in the Item Editors](#events-related-to-interactions-in-the-item-editors)
	- [Events Related to Submitting An Item Change from the Item Editors](#events-related-to-submitting-an-item-change-from-the-item-editors)
	- [Events Related to Changes in the Datastore](#events-related-to-changes-in-the-datastore)
	- [Feedback Events](#feedback-events)
	- [Fill Events: TBD](#fill-events-tbd)
- [References](#references)

<!-- /TOC -->

**Note to Lockbox Engineers:** *The variable names used in this doc are just placeholders. Once I know what they will actually be I can update them.*

This is the metrics collection plan for Lockbox's alpha release. It is more of a wishlist than a plan - only some portion of what's here might actually be implemented.

Best viewed in something that can render Markdown.

## TL;DR Metrics Implemented for Alpha Thus Far

These are the metrics that have been implemented in the pull request that included the edits to this doc.

All events are under the **category: lockbox**. The `extra` field always contains `fxaid` where possible (i.e. after FxA auth). In the future also the `itemid` where relevant.

1. `startup` fires when the webextension is loaded. **method**:click **objects**: addon, webextension.

2. `iconClick` fires when someone clicks the toolbar icon. **method**:startup **objects**: toolbar.

3. `render` fires when one of the views are rengered. **method**:render **objects**: firstrun, manage, popupUnlock

4. `signIn` fires when someone clicks the signin button during firstrun. **method**: render **objects**: signInPage.

5. `confirmPW` fires when the screen asking for password confirm renders. **method**: render **objects**: confirmPWPage.

6. `setupDone` fires after the user authenticates wtih fxa successfully and the message informing them of that renders. **method**: render **objects**: setupDonePage.

7. `itemAdding` fires when a user submits a new item from the editor. **method**: itemAdding **objects**: addItemForm.

8. `itemUpdating` fires when a user submits an edit to an existing item. **method**: itemUpdating **objects**: updatingItemForm.

9. `itemDeleting` fires when user submits a request to delete an item. **method**: itemDeleting **objects**: updatingItemForm.

10. `itemSelected` fires when a user clicks on an item in the item list. **method**: itemSelected **objects**: itemList.

11. `addClick` fires when a user clicks the add new item button from the item list . **method**: addClick **objects**: addButton.

12. `itemAdded` fires when the `addItemCompleted` function is called on the front end. Has itemid added as extra. **method**: itemAdded **objects**: addItemForm.

13. `datatore` fires when an item is added/updated/deleted from the backend.  Has itemid (and sometimes fields) added as extra. **methods**:added, updated, deleted **objects**: datastore.

14. `feedback` fires when the user clicks the "Send Feedback" button. **methods**:feedbackClick **objects**:manage

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

At this point, all measurements related to Lockbox will be made client-side. All users will have to authenticate through FxA, and thus additional measurements related to that will be logged on the FxA auth server. We have no control over what is already collected via that mechanism.

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

-   To log the FxA user id of the client logging the event (e.g. `"fxauid": uid`)
-   To log the UUID of the item that has been added or changed (e.g. `"item_id": UUID`)
-   To log the fields that are modified when an item is updated in the datastore (e.g. `"fields": "password,notes"`  (because the value has to be a string we will have to concat the fields that were updated somehow)

Once an event is registered, we can record it with:

`Services.telemetry.recordEvent(category, method, object, null, extra)`

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

## !!!!!!! EVERYTHING BELOW HERE IS OLD AND OUT OF DATE NOT IMPLEMENTED KEPT HERE FOR FUTURE REFERENCE ONLY !!!!!!!

### Setup Events

From a metrics point of view, the FxA sign-in / account creation process is a black box to us. Thus the best we can do at this point is track when a user interacts with the Lockbox-specific views that are included in the first run flow.

We have two **categories** of events here: rendering events and interaction events:  `lockbox_setup.render` and `lockbox_setup.interaction`. For rendering events, the **object** field is populated by the name of the view being rendered; for interaction events the **object** is the name of the button. Below is a brief description of the view names and their corresponding buttons.

-   `lockbox_toolbar_firstrun`
    -   Pop-over shown when the user first clicks on the Lockbox toolbar icon after install. Contains the `get_started_button`. Note that the click on the toolbar icon itself is logged in a separate event (see "Toolbar Button Interaction Event" section below).
-   `reenter_password`
    -   Shown after FxA process is completed. Prompts user to re-enter their FxA pw to start using lockbox. Contains the `lockbox_signin_button`


The **methods** for these events are `render` and `click` for rendering and interaction events, respectively.


The **extra** field contains the user's FxA anonymous/random user id. For `lockbox_toolbar_firstrun` view this will be `null`.


To register the rendering events:
```javascript
Services.telemetry.registerEvents("lockbox_setup.render", {
  "lockbox_setup.render": {
    methods: ["render"],
    objects: ["lockbox_toolbar_firstrun", // startup flow views
            "reenter_password"],
    extra: {"fxauid": uid} // value is null in some cases, see above
  }
});
```
To register the interaction events:
```javascript
Services.telemetry.registerEvents("lockbox_setup.interaction", {
  "lockbox_setup.click": {
    methods: ["click"],
    objects: ["get_started_button", // start-up flow buttons
              "lockbox_signin_button"],
    extra: {"fxauid": uid} // value is null in some cases, see above
  }
});
```
An example of how to record a rendering of the `reenter_password` view:
```javascript
Services.telemetry.recordEvent("lockbox_setup.render",
                    "render",
                    "reenter_password",
                    null,
                    {"fxauid": uid} ) // user has signed in by now);
```                    


To record (for example) a click on one of the `lockboxSignin_button` button:

```javascript
Services.telemetry.recordEvent("lockbox_setup.interaction",
                    "click",
                    "lockbox_signin_button",
                    null,
                    {"fxauid": null} ) // user hasn't signed in yet);
```                    


### Item list Interaction Events
These events relate to interactions with the item list rendered after a click of the Lockbox toolbar button. These events assume that the user has already logged in with FxA. For events related to the setup flow, see the section above.

Immediately after setup there will be no items in the datastore. As long as this is the case, the item list will be empty and the user will have to click the `add_new_button` to add their first entry. As long as there is at least one entry in the datastore, the item list will be displayed in the left pane.

We will have two categories of events related to the item list: `lockbox_item_list.render` and `lockbox_item_list.interaction`. They will be recorded as `lockbox_item_list.render` and `lockbox_item_list.click`.

For the rendering events, there are two possible objects, `item_list_empty` and `item_list_populated` corresponding to a rendering of an empty item list and an item list with at least one entry, respectively.

The possible **methods** are `click` and `render`.

The **objects** are `item_button` (the clickable area of an entry in the item list), `feedback_button`, `add_new_button` (available so long as there at least one item in the datastore), and `search_box`.


To register the interaction events:
```javascript
Services.telemetry.registerEvents("lockbox_item_list.interaction", {
  "lockbox_item_list.click": {
    methods: ["click"],
    objects: ["item_button",
        "feedback_button",
        "add_new_button",
        "search_box"],
    extra: {"fxauid": uid}
  }
});
```
To register the render events:
```javascript
Services.telemetry.registerEvents("lockbox_item_list.render", {
  "lockbox_item_list.render": {
    methods: ["render"],
    objects: ["item_list_empty",
        "item_list_populated"],
    extra: {"fxauid": uid}
  }
});
```


To record (for example) a click on the add new entry button:
```javascript
Services.telemetry.recordEvent("lockbox_item_list.interaction",
                    "click",
                    "add_new_button",
                    null,
                    {"fxauid": uid});
```

### Item View Interaction Events
When a user clicks on an item from the item list, they will be directed to the item view. We will log clicks on each of the five buttons in this view (also the **objects** used in the event): `edit_entry_button`, `delete_entry_button`, `show_password_button`, `copy_password_button`, and `copy_username_button`.


The event **category** is `item_view.interaction` and the event is recorded as `item_view.click`.

The **method** is `click`.

Example event registration:

```javascript
Services.telemetry.registerEvents("lockbox_item_view.interaction", {
  "lockbox_item_view.click": {
    methods: ["click"],
    objects: ["edit_entry_button",
		"delete_entry_button",
        "show_password_button",
        "copy_password_button",
        "copy_username_button"],
    extra: {"fxauid": uid}
  }
});
```
Example of recording a click to show password event:

```javascript
Services.telemetry.recordEvent("lockbox_item_view.interaction",
                    "click",
                    "show_password_button",
                    null,
                    {"fxauid": uid});
```

### Events Related to Interactions in the Item Editors
These events record actions users take in the item editors. There are separate views for editing existing items and for adding new entries, though the fields that exist in each are similar. Thus we have four **categories** of events: `lockbox_new_item.interaction`, `lockbox_edit_item.interaction` and the rendering events `lockbox_new_item.render` and `lockbox_edit_item.render`.

For events related to the submission of actual item information, see the next section. The item editors have 5 fields: `title_field`, `origin_field` (URL for the credential), `username_field`, `password_field`, and `notes_field`. There are also three buttons: `save_entry_button`, `cancel_button`, and `toggle_password_button`. The latter toggles the visibility of characters in the password field.  


The **methods** are `click` and `render`.

Example event registration (Substitute `lockbox_new_item` with `lockbox_edit_item` to register events for the existing item editor):

```javascript
Services.telemetry.registerEvents("lockbox_new_item.interaction", {
  "lockbox_item_editor.click": {
    methods: ["click"],
    objects: ["title_field",
        "origin_field",
        "username_field",
        "password_field",
        "notes_field",
        "save_entry_button",
        "cancel_button",
        "toggle_password_button"],
    extra: {"fxauid": uid}
  }
});
```
For the rendering events:

```javascript
Services.telemetry.registerEvents("lockbox_new_item.render", {
  "lockbox_item_editor.render": {
    methods: ["render"],
    objects: ["lockbox_new_item_view"],
    extra: {"fxauid": uid}
  }
});
```



Example of recording a click on the `save_entry_button`:

```javascript
Services.telemetry.recordEvent("lockbox_item_editor.interaction",
                    "click",
                    "save_entry_button",
                    null,
                    {"fxauid": uid});
```

### Events Related to Submitting An Item Change from the Item Editors
Events of **category** `lockbox_item_change_submitted` record the actual submission of new item information to the datastore (either completely new entries or updates to existing items).


In theory, these should be tied to equivalent events in the datastore, so that (for example) an `adding` event which is logged when a user submits a new item has a corresponding `added` event that gets logged when the item is successfully added to the datastore. This may need to change, but for simplicity's sake I've made it as close to the datastore events as possible (see next section). These events will be recorded as `lockbox_item_change_submitted`.

**Methods** for this event are `adding`, `updating` and `deleting`.

The **object** can be `new_item` or `edit_item`.

The **extra** field contains the item's UUID *for updating and deleting events only*. For adding events, it always contains the string "new".

To register these events, we would do something like:
```javascript
Services.telemetry.registerEvents("lockbox_item_change_submitted", {
  "lockbox_item_change_submitted": {
    methods: ["adding","updating","deleting"],
    objects: ["new_item","edit_item"],
    extra: {"fxauid": uid,
            "item_id": UUID}
  }
});
```

To record a new item submission (note the `item_id` is "new"):
```javascript
Services.telemetry.recordEvent("lockbox_item_change_submitted",
                    "added",
                    "new_item",
                    null,
                    {"fxauid": uid,
                    "item_id": "new"});
```

### Events Related to Changes in the Datastore
We will record an event of **category** `lockbox_datastore.changed` when there is a change to the datastore. These events will be recorded as `lockbox_entry_changed`.

**Methods** for this event are `added`, `updated` and `deleted`.

The **object** field is always `datastore`.

The **extra** field contains the item's (hashed) UUID. This will allow us to track changes to an item over its lifetime. When the method is `updated`, this field also includes a list indicating which fields in the credential were updated.

To register these events, we would do something like:
```javascript
Services.telemetry.registerEvents("lockbox_datastore.changed", {
  "lockbox_entry_changed": {
    methods: ["added","updated","deleted"],
    objects: ["datastore"],
    extra: { "fxauid": uid,
    "item_id": UUID,
    "fields": "title,origins,login.password,login.notes" }  }
});
```

An example of logging an item update in the datastore:
```javascript
Services.telemetry.recordEvent("lockbox_database.changed",
                    "updated",
                    "datastore",
                    null,
                    {"fxauid": uid,
                    "item_id": UUID,
                    "fields": "username,password"});
```

### Feedback Events

When the user enters the feedback form through the button on the item list, we will record an event when a user submits feedback. Note that this will *not* contain the feedback itself: that is logged elsewhere (not thru telemetry).


```javascript
Services.telemetry.registerEvents("lockbox_feedback.interaction", {
  "lockbox_feedback_submit.click": {
    methods: ["click"],
    objects: ["submit_button"],
    extra: {"fxauid": uid}
  }
});
```
To record (for example) a click of the toolbar:
```javascript
Services.telemetry.recordEvent("lockbox_feedback.interaction",
                    "click",
                    "submit_button",
                    null,
                    {"fxauid": uid});
```                    

### Fill Events: TBD
This section will describe the events related to auto-filling login credentials on web forms using items from the datastore. Since this isn't invented yet, its empty.

---

## References

Docs for the Public JS API that allows us to log events thru an add-on:

https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/telemetry/collection/events.html#the-api
