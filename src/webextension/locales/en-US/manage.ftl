toolbar-item-count = { $count ->
   [one]   1 item
  *[other] { $count } items
}

toolbar-add-item = Add Item
toolbar-go-home = Home
toolbar-send-feedback = Feedback

item-filter.placeholder = Filter…

item-summary-new-item = (new item)
item-summary-no-title = (no title)
item-summary-no-username = (no username)

homepage-no-passwords =
  Welcome to Lockbox! I'm Lockie, and I'm here to help you lock
  up your passwords!
  
  To get started, click { add-item } above.

homepage-under-10-passwords = { $count ->
   [1]     Hi there! It's your friend, Lockie!
           
           You've added { $count } password. That's a great start!
  *[other] Hi there! It's your friend, Lockie!
           
           You've added { $count } passwords. That's a great start!
}

homepage-under-50-passwords =
  Hey again! Just your pal Lockie checking in!
  
  You've added { $count } passwords. Great job, keep it up!

homepage-over-50-passwords =
  Welcome back! I hope you're having a great day!
  
  You've added { $count } passwords. Wow, I'm really impressed!

item-details-title = Title
item-details-origin = Origin
item-details-username = Username
item-details-copy-username = Copy
  .title = Copy the username to the clipboard
item-details-password = Password
item-details-copy-password = Copy
  .title = Copy the password to the clipboard
item-details-notes = Notes

item-details-edit = Edit
item-details-delete = Delete

item-details-save = Save
item-details-cancel = Cancel

[[dialogs]]

modal-root-title = Modal dialog

modal-cancel
  .text = This item has unsaved changes? Are you sure you want to discard them?
  .primaryButtonLabel = Discard
  .secondaryButtonLabel = Go back
modal-delete
  .text = Are you sure you want to delete this item?
  .primaryButtonLabel = Delete
  .secondaryButtonLabel = Cancel
