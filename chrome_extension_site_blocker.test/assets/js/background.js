//when chrome extension is installed for the first time, set default values
chrome.runtime.onInstalled.addListener(() => {
  //using chrome.storage.sync means any values we set are available across all browsers signed in to the same user account for the extension
  chrome.storage.sync.set(
    {
      toggleSitesActive: false,
      toggleSitesList: 'example.com',
    },
    () => {}
  ) //set expects a callback as a second parameter which contains an error or storage items that were set, but here we're just returning back an empty function
})

//set up the initial chrome storage values
let toggleSitesActive = false
let toggleSitesList = 'example.com'

//using chrome.storage.sync.get() method will pull in an array of values from the storage API
chrome.storage.sync.get(
  ['toggleSitesActive', 'toggleSitesList'],
  (result) => {
    toggleSitesActive = result.toggleSitesActive
    toggleSitesList = result.toggleSitesList
  } //replace the initial chrome storage values above with ones from synced storage
)
/*the extension needs some values to start with since chrome.storage.sync.get() method is also an asychronous function
just like the chrome.storage.sync.set() method, hence the need to do the replacement of values*/
