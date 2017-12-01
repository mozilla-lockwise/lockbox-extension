"""Representation of the Home page for lockbox."""

from pypom import Page, Region
from selenium.webdriver.common.by import By

from pages.util.util import munged_class_name


class Home(Page):
    """Contain the locators and actions relating to the home page."""

    _entries_locator = (By.CSS_SELECTOR,
                        'ul li div.{}'.format(
                            munged_class_name('item-summary')))
    _lockie_locator = (By.CLASS_NAME, '{} h1'.format(
                       munged_class_name('homepage')))
    _delete_entry_locator = (By.CSS_SELECTOR,
                             'article div menu '
                             'button.{}'.format(munged_class_name('minimal')))
    _delete_entry_modal_locator = (By.CSS_SELECTOR,
                                   '.ReactModal__Content--after-open '
                                   'menu button.{}'.format(
                                       munged_class_name('button')))
    _new_entry_locator = (By.CSS_SELECTOR,
                          'section menu '
                          'button.{}:nth-child(3)'.format(
                            munged_class_name('button')))
    _save_entry_locator = (By.CSS_SELECTOR, 'article div form menu '
                           'button.{}'.format(munged_class_name('button')))

    @property
    def lockie(self):
        """Lockie image locator."""
        return self.find_element(*self._lockie_locator).text

    def add_entry(self):
        """Add an entry into the lockbox."""
        current_entries = len(self.entries)
        self.find_element(*self._new_entry_locator).click()
        self.find_element(*self._save_entry_locator).click()
        self.wait.until(lambda _: len(self.entries) != current_entries)

    def delete_entry(self):
        """Delete an entry from lockbox."""
        self.find_element(*self._delete_entry_locator).click()
        self.find_element(*self._delete_entry_modal_locator).click()
        self.wait.until(lambda _: len(self.entries) == 0)

    @property
    def entries(self):
        """List of current entries."""
        els = self.find_elements(*self._entries_locator)
        return [Entry(self, el) for el in els]


class Entry(Region):
    """Entry specific locators and functions."""

    _name_locator = (By.CSS_SELECTOR, 'div.{}'.format(
                     munged_class_name('title')))

    @property
    def name(self):
        """Return the name of the entry."""
        return self.find_element(*self._name_locator).text

    def click(self):
        """Click on the entry."""
        self.root.click()
        return self.EntryDetail(self)

    class EntryDetail(Region):
        """Entry detail locators and functions."""

        _delete_entry_locator = (By.CSS_SELECTOR,
                                 'article div menu '
                                 'button.{}'.format(
                                    munged_class_name('ghost-theme')))
        _delete_entry_modal_locator = (By.CSS_SELECTOR,
                                       '.ReactModal__Content--after-open '
                                       'menu button.{}'.format(
                                           munged_class_name('button')))

        def delete(self):
            """Delete an entry from the lockbox."""
            self.find_element(*self._delete_entry_locator).click()
            self.find_element(*self._delete_entry_modal_locator).click()
