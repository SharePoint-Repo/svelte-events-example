export let config = {
  baseUrl: "http://localhost:8080",
  lists: [
      {
        name: 'ALL EVENTS',
        tabStatus: ' activeTab'
      },
      {
        name: 'calendar',
        tabStatus: ' inactiveTab'
      },
      {
        name: 'calendar2',
        tabStatus: ' inactiveTab'
      }, 
      { name: 'calendar3',
        tabStatus: ' inactiveTab'
      },
      {
        name: 'BLDG 3350 RM 102',
        tabStatus: ' inactiveTab'
      },
  ], 
  replaceText: /BLDG\s\d+\s/

};