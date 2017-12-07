"""Door hanger interaction functions."""

from pypom import Region
from selenium.webdriver.common.by import By

from pages.util.util import munged_class_name


class DoorHanger(Region):
    """Contain the locators and actions relating to the door habger."""

    _entry_list = (By.CLASS_NAME, '{}'.format(
                   munged_class_name('item-summary')))
    _manage_button_locator = (By.CLASS_NAME, '{}'.format(
                              munged_class_name('ghost-theme')))
    _panel_locator = (By.CSS_SELECTOR,
                      '#PanelUI-webext-lockbox_mozilla_' +
                      'com-browser-action-view')
    _lockbox_button_locator = (By.ID, 'lockbox_mozilla_com-browser-action')
    _xul_browser_locator = (By.CLASS_NAME, 'webextension-popup-browser')

    def _open_and_switch_to_hanger(self):
        """Open the door hanger and switch to it."""
        with self.selenium.context(self.selenium.CONTEXT_CHROME):
            self.find_element(*self._lockbox_button_locator).click()
            self.wait.until(
                lambda s: s.find_element(*self._panel_locator).is_displayed())
            panel = self.find_element(*self._panel_locator)
            hanger = panel.find_element(*self._xul_browser_locator)
            self.selenium.switch_to_frame(hanger)

    def find_entrys(self):
        """Find all entrys."""
        self._open_and_switch_to_hanger()
        with self.selenium.context(self.selenium.CONTEXT_CHROME):
            els = self.selenium.find_elements(*self._entry_list)
            return [self.Entry(self) for el in els]

    def click_manage(self):
        """Click the manage button."""
        self._open_and_switch_to_hanger()
        with self.selenium.context(self.selenium.CONTEXT_CHROME):
            self.find_element(*self._manage_button_locator).click()

    class Entry(Region):
        """Contain the locators and actions regarding a single entry."""

        _entry_title_locator = (By.CLASS_NAME, '{}'.format(
                                munged_class_name('title')))
        _entry_subtitle_locator = (By.CLASS_NAME, '{}'.format(
                                   munged_class_name('subtitle')))

        @property
        def title(self):
            """Entry title."""
            with self.selenium.context(self.selenium.CONTEXT_CHROME):
                return self.find_element(*self._entry_title_locator).text

        @property
        def subtitle(self):
            """Entry Subtitle."""
            with self.selenium.context(self.selenium.CONTEXT_CHROME):
                return self.find_element(*self._entry_subtitle_locator).text

        def click(self):
            """Click on the entry."""
            with self.selenium.context(self.selenium.CONTEXT_CHROME):
                self.find_element(*self._entry_title_locator).click()
                return self.EntryDetail(self)

        class EntryDetail(Region):
            """Contain the locators and actions for a specific entry."""

            _root_locator = (By.CLASS_NAME, '{}'.format(
                             munged_class_name('panel-body')))
            _entry_name_locator = (By.CSS_SELECTOR, '.{}'.format(
                                   munged_class_name('field-text')))

            @property
            def title(self):
                """Entry title."""
                with self.selenium.context(self.selenium.CONTEXT_CHROME):
                    return self.find_element(*self._entry_name_locator).text
