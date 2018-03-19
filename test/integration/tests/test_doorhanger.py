"""Tests for the door hanger."""


def test_door_hanger_interaction(fxa_account, login_page):
    """Add an entry and test it shows in the door hanger."""
    fxa = fxa_account
    home_page = login_page.sign_in(fxa.email, fxa.password)
    home_page.create_new_entry("Tuna, Inc.", "https://satuna.org", "tuna4life",
                               "tunafish", "The tuna swim at midnight")
    lists = home_page.door_hanger.find_entrys()
    assert 'Tuna, Inc.' in lists[0].title
    entry = lists[0].click()
    assert 'Tuna, Inc.' in entry.title
