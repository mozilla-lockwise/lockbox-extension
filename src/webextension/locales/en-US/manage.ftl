document
  .title = Lockbox Entries

toolbar-item-count =
  { $count ->
     [one]   1 Entry
    *[other] { $count } Entries
  }

toolbar-add-item = New Entry
toolbar-go-home = Home
toolbar-send-feedback = Feedback

item-filter
  .placeholder = Search for an entry

all-items-empty =
  Looks like you don't have any entries saved yet…
  
  Create a new entry so Lockie has something to protect.
all-items-filtered = No results

item-summary-new-title = New Entry
item-summary-title =
  { $length ->
     [0]     (No Entry Name)
    *[other] { $title }
  }
item-summary-username =
  { $length ->
     [0]     (No Username)
    *[other] { username }
  }

homepage-no-passwords =
  Welcome to Lockbox! I'm Lockie, and I'm here to help you lock
  up your passwords!
  
  To get started, click { toolbar-add-item } above.

homepage-under-10-passwords =
  { $count ->
     [1]     Hi there! It's your friend, Lockie!
           
             You've added { $count } entry. That's a great start!
    *[other] Hi there! It's your friend, Lockie!
           
             You've added { $count } entries. That's a great start!
  }

homepage-under-50-passwords =
  Hey again! Just your pal Lockie checking in!
  
  You've added { $count } entries. Great job, keep it up!

homepage-over-50-passwords =
  Welcome back! I hope you're having a great day!
  
  You've added { $count } entries. Wow, I'm really impressed!

item-details-heading-view = Entry Details
item-details-heading-new = Create a New Entry
item-details-heading-edit = Edit Entry

item-details-title = Entry Name
item-details-origin = Website Address
item-details-username = Username
item-details-copy-username = Copy
  .title = Copy the username to the clipboard
item-details-password = Password
item-details-copy-password = Copy
  .title = Copy the password to the clipboard
item-details-notes = Notes

item-details-edit = Edit Entry
item-details-delete = Delete Entry

item-details-save-new = Save Entry
item-details-save-existing = Save Changes
item-details-cancel = Cancel

[[dialogs]]

modal-cancel-editing = This entry has unsaved changes. Are you sure you want to discard them?
  .confirmLabel = Discard Changes
  .cancelLabel = Go Back

modal-delete = Are you sure you want to delete this entry?
  .confirmLabel = Delete Entry
  .cancelLabel = Cancel
