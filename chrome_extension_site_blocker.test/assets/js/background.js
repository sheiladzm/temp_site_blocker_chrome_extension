//main functionality: block a list of websites depending on active state of toggle and websites entered in textbox

//when chrome extension is installed for the first time, set default values
chrome.runtime.onInstalled.addListener(() => {
  //using chrome.storage.sync means any values we set are available across all browsers signed in to the same user account for the extension
  chrome.storage.sync.set(
    {
      toggleSitesActive: false,
      toggleSitesList: 'example.com',
    },
    //set expects a callback as a second parameter which contains an error or storage items that were set, but here we're just returning back an empty function
    () => {}
  )
})

//set up the initial chrome storage values
let toggleSitesActive = false
let toggleSitesList = 'example.com'

//using chrome.storage.sync.get() method will pull in an array of values from the storage API
chrome.storage.sync.get(
  ['toggleSitesActive', 'toggleSitesList'],
  //replace the initial chrome storage values above with ones from synced storage
  (result) => {
    toggleSitesActive = result.toggleSitesActive
    toggleSitesList = result.toggleSitesList
  }
)
/*the extension needs some values to start with since chrome.storage.sync.get() method is also an asychronous function
just like the chrome.storage.sync.set() method, hence the need to do the replacement of values*/

//on each site request, if it's in toggleSitesList, block it
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    //if the toggle is inactive, do not block sites
    if (!toggleSitesActive) {
      return { cancel: false }
    }

    //determine if url is in toggleSitesList
    let cancel = toggleSitesList
      .split(/\n/) //set cancel to toggleSitesList split by a new line into an array
      //.some expects a callback function with the only parameter being a single item in that array
      .some((site) => {
        //for each url item, generate a new url object from the details webRequest object url property
        let url = new URL(details.url)
        //return a boolean value
        return Boolean(url.hostname.indexOf(site) !== -1) //check if that url's hostname contains the single item from our .some filter of the toggleSitesList
      })
    //.some returns true if ANY of the url items in the array passes the filter provided by the callback function
    //so cancel will be true if url placed inside the toggleSitesList via the extension matches the url of the incoming web request
    return { cancel: cancel }
  },
  //second parameter - a filter object which will listen to all urls
  {
    urls: ['<all_urls>'],
  },
  //third parameter - an array containing event type info
  ['blocking']
)

//whenever a storage item is updated, update the global variables (toggleSitesActive & toggleSitesList)
chrome.storage.onChanged.addListener((changes, namespace) => {
  //sync is the method we're using - called in the beginning
  if (namespace === 'sync') {
    if (changes.toggleSitesActive) {
      toggleSitesActive = changes.toggleSitesActive.newValue
    }
    if (changes.toggleSitesList) {
      toggleSitesList = changes.toggleSitesList.newValue
    }
  }
})
