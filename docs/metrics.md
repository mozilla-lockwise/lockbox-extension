# Lockbox Metrics Plan

_Last Updated: Nov 14, 2017_

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Analysis](#analysis)
- [Collection](#collection)
	- [Event Registration and Recording](#event-registration-and-recording)
- [Metrics Overview](#metrics-overview)
- [Non-Event Metrics](#non-event-metrics)
- [List of Events Currently Recorded](#list-of-events-currently-recorded)
- [References](#references)

<!-- /TOC -->

This is the metrics collection plan for Lockbox's alpha release. It documents all events currently collected through telemetry, as well those planned for collection but not currently implemented. It will be updated to reflect all new and planned data collection.

## Analysis

Data collection is done solely for the purpose of product development, improvement and maintenance. We are particularly interested in data that will help us answer the following questions.

- Do people Save Passwords in Lockbox?
    - How many? (measured by count of items saved per user)
    - How often? (number of credentials saved per user per time interval)
- Do people create their own passwords or use Lockbox to generate them?
    - Ratio: (Number of times the PW generator is used when storing an item) / (number of credentials stored)
- Do people use the passwords they store on Lockbox?
    - How many times (per some unit of time) do stored credentials get auto-filled or copied to the clipboard?
    - How many times do users click to reveal a password?
- How well does does auto-filling credentials work **(not in alpha)**?
    - When credentials are auto-filled, are they filled into the correct fields?
    - How often must the user make a change to what fields were filled?
        - How to measure these things??? is there an easier way than just asking if the auto-fill didn't work?
- Do people continue to use Lockbox after first use?
    - Out of those who install, how many use it more than once?
- Where are the drop-off points in the user flow?
    - Do the majority of people make it all the way through the setup process?
    - Once initially setup, do people continue to add credentials?
- What are people's opinions on LB
    - Feedback forms
- Do people sync their passwords **(not in alpha)**?
    - How does syncing affect engagement?
- What type of sites do people use Lockbox with?
    - Do they use Lockbox only for their most sensitive accounts?

## Collection

**Note:** *This is the collection plan for our internal alpha release. For our beta release will be taking advantage of test pilot's telemetry API. The metrics plan for beta will be described in a separate document.*

At this point, all measurements related to Lockbox will be made client-side. Eventually all users will have to authenticate through FxA, and thus additional measurements related to that will be logged on the FxA auth server. We have no control over what is already collected via that mechanism.

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

(this section may redundant with analysis section)
For alpha, we'd like to (ideally) like to be able to track the following general categories of things:

-   The setup flow, so we can know at what points (if any) people quit the flow before finishing it
-   Top-level interactions centered around use of the Lockbox toolbar icon. This includes interactions within the initial doorhanger that is displayed when the user clicks the icon.
-   Interactions with the list of the user's Lockbox items (credentials)
-   Interactions with the add / modify dialogs used to enter / edit item information
-   Changes to the datastore that actually contains the user's items, in addition to user actions that lead to those changes
-   When the user submits feedback about lockbox
-		Usage of the copy and reveal functions for stored Lockbox items.

Each of these are described below within their own Events subsection.


## Non-Event Metrics

These are the metrics we plan to collect regarding the state of user datastores. Note that we won't be able to record these directly for alpha. We will have to infer them from the event data.

-   `n_items` The number of credentials that exist in the user's datastore. Integer

-   `n_notes` The number of items for which the user has manually entered custom notes for. Integer

-   `timestamp_last` The timestamp of the last edit the user made to the datastore. Does not necessarily correspond to the last time they opened the CRUD editor.

-   `n_uses` The number of times a user copied or auto-filled a Lockbox item.

## List of Events Currently Recorded

All events are currently implemented under the **category: lockboxV0**. The `extra` field always contains `fxaid` where possible (i.e. after FxA auth). For events pertaining to a particular Lockbox item, `itemid` is also included. They are listed and grouped together based on the contents of the event's `method` field.

1. `startup` fires when the webextension is loaded. **objects**: webextension. Note that this event fires whenever the browser is started, so is not indicative of direct user interaction with Lockbox.

2. `iconClick` fires when someone clicks the toolbar icon. **objects**: toolbar

3. `render` events fire when the firstrun view (showing the initial lockbox setup form), item manager or doorhanger (when implemented) are rendered. **objects**: firstrun, manage, doorhanger

4. `itemAdding`, `itemUpdating`, `itemDeleting` fire when a user clicks to submit a new item or edit or delete an existing item. **objects**: addItemForm, updatingItemForm

5.  `itemAdded`, `itemUpdated`, `itemDeleted` fire after a successful add/update/delete action. **objects**: addItemForm, updatingItemForm

6. `added`, `updated`, `deleted` fire when an item is added/updated/deleted in the backend datastore. Has itemid in the extra field. **objects**: datastore

7. `itemSelected` fires when a user clicks an item in the itemlist. **objects** itemList  

8. `itemCopied` fires when a user copies their username or password from an item. **objects**: entryDetails

9. `feedbackClick` fires when the user clicks the "Send Feedback" button. **objects**: manage

10. `resetRequested` fires when the user clicks the "Reset" button in the Lockbox settings. **objects**: settings

11. `resetCompleted` fires when the user completes a reset of their Lockbox data in the Lockbox settings. **objects**: settings

## List of Planned Events

These events will be implemented once the corresponding functionality is available.

1. `fxaSignIn` fires when someone clicks the signin button during firstrun. **objects**: fxaSignInPage.

2. `confirmPW` fires when the user clicks the button to confirm their FxA pw. **objects**: confirmPWButton

3. `doorhangerItemSelected` fires when a user clicks an item in the doorhanger's itemlist. **objects** doorhanger  

4. `doorhangerItemCopied` fires when a user copies an item's username/password from the doorhanger's entry view. **objects** doorhangerEntryDetails.  

5. `doorhangerAddClick` fires when the user clicks to add a new entry from the doorhanger. **objects** doorhanger  


---

## References

Docs for the Public JS API that allows us to log events thru an add-on:

https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/telemetry/collection/events.html#the-api
