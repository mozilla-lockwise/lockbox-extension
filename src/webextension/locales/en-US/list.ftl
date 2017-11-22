[[common]]

document
  .title = Lockbox Entries

item-fields-title = Entry Name
item-fields-title-input
  .placeholder = Primary Bank
item-fields-origin = Website Address
item-fields-origin-input
  .placeholder = www.example.com
item-fields-username = Username
item-fields-username-input
  .placeholder = name@example.com
item-fields-copy-username = Copy
  .title = Copy the username to the clipboard
item-fields-password = Password
item-fields-copy-password = Copy
  .title = Copy the password to the clipboard
item-fields-notes = Notes
item-fields-notes-input
  .placeholder = Answers to security questions or other account specifics…

item-summary-new-title = New Entry
item-summary-title =
  { $length ->
     [0]     (No Entry Name)
    *[other] { $title }
  }
item-summary-username =
  { $length ->
     [0]     (No Username)
    *[other] { $username }
  }

item-filter
  .placeholder = Search for an entry

[[manage]]

toolbar-item-count =
  { $count ->
     [one]   1 Entry
    *[other] { $count } Entries
  }

toolbar-add-item = New Entry
toolbar-go-home = Home
toolbar-send-feedback = Provide Feedback

all-items-empty =
  When you create an entry, it will be saved in this sidebar.

all-items-filtered = No results

homepage-title =
  { $count ->
     [0]     Welcome to { product-title }
     [1]     You have { $count } entry in your { product-title }
    *[other] You have { $count } entries in your { product-title }
  }

homepage-greeting =
  You’ve successfully installed the Lockbox browser extension! This Alpha
  prototype gives you the ability to create new entries, and then view, search,
  edit, and delete those entries.
  
  Please be sure to let us know your thoughts using our feedback button above,
  including any issues you may find, things you like, and the things you’re
  looking forward to in the future.

homepage-linkaccount-title = Add Serious Security & Convenience
homepage-linkaccount-description =
    Creating a Firefox account – or adding { product-title } to an existing account – protects your logins
    with the strongest encryption available.

homepage-linkaccount-action-create = Create Account
homepage-linkaccount-action-signin = { product-action-signin }

homepage-accountlinked-title = Your logins are locked down tight!
homepage-accountlinked-description =
    { product-title } uses the strongest encryption available to protect
    your logins – even for banking and other critical sites.

item-details-heading-view = Entry Details
item-details-heading-new = Create a New Entry
item-details-heading-edit = Edit Entry

item-details-edit = Edit Entry
item-details-delete = Delete Entry

item-details-save-new = Save Entry
item-details-save-existing = Save Changes
item-details-cancel = Cancel

[[popup]]

manage-lockbox-button = Manage Lockbox

item-details-panel-title = Entry Details

[[dialogs]]

modal-cancel-editing = This entry has unsaved changes. Are you sure you want to discard them?
  .confirmLabel = Discard Changes
  .cancelLabel = Go Back

modal-delete = Are you sure you want to delete this entry?
  .confirmLabel = Delete Entry
  .cancelLabel = Cancel
