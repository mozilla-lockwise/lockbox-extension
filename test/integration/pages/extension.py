from pypom import Region
from selenium.webdriver.common.by import By

from pages.util.util import munged_class_name


class Extension(Region):

    _entry_list = (By.CLASS_NAME, '{}'.format(
                   munged_class_name('item-summary')))
    _panel_locator = (By.CSS_SELECTOR,
        '#PanelUI-webext-lockbox_mozilla_com-browser-action-view')
    _lockbox_button_locator = (By.ID, 'lockbox_mozilla_com-browser-action')
    _xul_browser_locator = (By.CLASS_NAME, 'webextension-popup-browser')

    def _open_and_switch_to_hanger(self):
        with self.selenium.context(self.selenium.CONTEXT_CHROME):
            self.find_element(*self._lockbox_button_locator).click()
            self.wait.until(lambda s: s.find_element(*self._panel_locator).is_displayed())
            panel = self.find_element(*self._panel_locator)
            hanger = panel.find_element(*self._xul_browser_locator)
            self.selenium.switch_to_frame(hanger)

    def find_stuff(self):
        self._open_and_switch_to_hanger()
        with self.selenium.context(self.selenium.CONTEXT_CHROME):
            # self.find_element(*self._lockbox_button_locator).click()
            # import time
            # time.sleep(5)
            # self.wait.until(lambda s: s.find_element(*self._panel_locator).is_displayed()) 
            # panel = self.find_element(*self._panel_locator)
            # panel_1 = panel.find_element_by_class_name('webextension-popup-stack')
            # hanger = panel.find_element(*self._xul_browser_locator)
            # self.selenium.switch_to_frame(hanger)
            els = self.selenium.find_elements(*self._entry_list)
            return [self.Entry(self) for el in els]

    class Entry(Region):

        _entry_title_locator = (By.CLASS_NAME, '{}'.format(
                                munged_class_name('title')))
        _entry_subtitle_locator = (By.CLASS_NAME, '{}'.format(
                                   munged_class_name('subtitle')))

        @property
        def title(self):
            with self.selenium.context(self.selenium.CONTEXT_CHROME):
                return self.find_element(*self._entry_title_locator).text

        @property
        def subtitle(self):
            with self.selenium.context(self.selenium.CONTEXT_CHROME):
                return self.find_element(*self._entry_subtitle_locator).text
        
        def click(self):
            with self.selenium.context(self.selenium.CONTEXT_CHROME):
                self.find_element(*self._entry_title_locator).click()
                return self.EntryDetail(self)

        class EntryDetail(Region):
            
            _root_locator = (By.CLASS_NAME, '{}'.format(
                             munged_class_name('panel-body')))
            _entry_name_locator = (By.CSS_SELECTOR, '.{}'.format(
                                   munged_class_name('field-text')))

            @property
            def title(self):
                with self.selenium.context(self.selenium.CONTEXT_CHROME):
                    return self.find_element(*self._entry_name_locator).text
