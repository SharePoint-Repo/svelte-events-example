import {isBefore, parseISO} from 'date-fns'; 



/*#if _SPVER == 2013 || _SPVER == 2016 || _SPVER == 2019
import {sp} from "@pnp/sp";
export let getData = async (config)=>{
   
    sp.setup({
        sp: {
            ie11: true,
            defaultCachingStore: "local", // or "local"
            defaultCachingTimeoutSeconds: 360,
            globalCacheDisable: false, // or true to disable caching in case of debugging/testing
            headers: {
                Accept: "application/json;odata=verbose",
            },
            baseUrl: config.baseUrl 
        }
    });

    let items = [];
    const today = new Date().toISOString();
    for(let list of config.lists){
        if(list.name == 'ALL EVENTS'){continue;}
        await sp.web.lists.getByTitle(list.name)
        .items
        .filter('EventDate ge datetime' +"'" + today + "'")
        .orderBy("EventDate")
        .top(5)
        .get()
        .then(response => {
           
            let temp = response.map(row => {
                row.list = list.name;
                row.linkUrl = (config.baseUrl) + "/list/" + (list.name) + "/DispForm.aspx?ID=" + (row.ID);
                row.EventDate = parseISO(row.EventDate); 
                row.EndDate = parseISO(row.EndDate);
                return row;
            });
                
            items = [...items,...temp];
        })
    }
    items.sort((a,b) => {
        if( isBefore(a.EventDate, b.EventDate)){return -1;}
        return 1;
    }) ;
    
    return items; 
}


//#elif  _SPVER == 'o365'
export const getData = async (config)=>{
    sp.setup({
        sp: {
            ie11: true,
            defaultCachingStore: "local", // or "local"
            defaultCachingTimeoutSeconds: 360,
            globalCacheDisable: false, // or true to disable caching in case of debugging/testing
            headers: {
                Accept: "application/json;odata=verbose",
            },
            baseUrl: config.baseUrl 
        }
    });
    const overrideViewXml =  `
            <View>
                <QueryOptions>
                        <ExpandRecurrence>"TRUE"</ExpandRecurrence>
                        <RecurrenceOrderBy>"TRUE"</RecurrenceOrderBy>
                        <ViewAttributes Scope="RecursiveAll"/>
                </QueryOptions>
                <Orderby>
                    <FieldRef Name="EventDate"/>
                </Orderby>
                <Query>
                    <Where>
                        <DateRangesOverlap>
                            <FieldRef Name="EventDate"></FieldRef>
                            <FieldRef Name="EndDate"></FieldRef>
                            <FieldRef Name="RecurrenceID"></FieldRef>
                            <Value Type="DateTime">
                                <Now/>
                            </Value>
                        </DateRangesOverlap>
                    </Where>
                </Query>
            </View>
            `
    
    let items = [];
    
    for(let list of config.lists){
        if (list.name == 'ALL EVENTS'){continue;}
        await sp.web.lists.getByTitle(list.name)
        .renderListDataAsStream({

            OverrideViewXml: overrideViewXml,
            
            Paging:'Paged=TRUE&RowLimit=5'
        })
        .then(response => {
          
            let temp = response.Row.map(row => {
                row.list = list.name;
                row.linkUrl = (config.baseUrl) + "/list/" + (list.name) + "/DispForm.aspx?ID=" + (row.ID);
                row.EventDate = parseISO(row['EventDate.']); 
                row.EndDate = parseISO(row['EndDate.'])
                return row; 
            });
            
            items = [...items,...temp];
        })
    }
    items.sort((a,b) => {
        if( isBefore(a.EventDate, b.EventDate)){return -1}
        return 1
    }) ;
  
    return items;
}
//#else */
import jQuery from 'jquery';

(window).global = window;

if (global === undefined) {
    var global = window;
} 		
window.$ = window.jQuery = jQuery;	
require('../node_modules/spservices/dist/jquery.SPServices');



export const getData = async (config)=>{
    const startDate = new Date();
    var items = [];
    for(let list of config.lists){
        if ((list.name) == "ALL EVENTS"){continue;}
        else{
            await $().SPServices({
                
            operation: "GetListItems",
            webURL: config.baseUrl,
            async: false,
            listName: list.name,
            CAMLViewFields: `<ViewFields>
                <FieldRef Name='ID' />
                <FieldRef Name='Title' />
                <FieldRef Name='EventDate' />
                <FieldRef Name='EndDate' />
                <FieldRef Name='Location' /> 
                <FieldRef Name='Description' /> 
                <FieldRef Name='fRecurrence' /> 
                <FieldRef Name='RecurrenceData' /> 
                <FieldRef Name='fAllDayEvent' /> 
            </ViewFields>`,
            CAMLQuery: `<Query> 
                <Where> 
                    <DateRangesOverlap> 
                        <FieldRef Name='EventDate' /> 
                        <FieldRef Name='EndDate' /> 
                        <FieldRef Name='RecurrenceID' /> 
                        <Value Type='DateTime'> 
                            <Week /> 
                        </Value> 
                    </DateRangesOverlap> 
                </Where> 
                <OrderBy> 
                    <FieldRef Name='EventDate' /> 
                </OrderBy> 
            </Query>`,
            CAMLQueryOptions: `<QueryOptions> 
                <CalendarDate>  ${startDate}  </CalendarDate> 
                <RecurrencePatternXMLVersion>v3</RecurrencePatternXMLVersion> 
                <ExpandRecurrence>TRUE</ExpandRecurrence> 
            </QueryOptions>`,
            CAMLRowLimit: 5,
            completefunc: function (xData, Status) {
                $(xData.responseXML).SPFilterNode("z:row").each(function() {
                    
                    var $node = $(this);
                    var row = {
                        Title: $node.attr("ows_Title"),
                        list: list.name, 
                        linkUrl:(config.baseUrl) + "/Lists/" + (list.name) + "/DispForm.aspx?ID=" + $node.attr("ows_ID"),
                        EventDate: parseISO($node.attr("ows_EventDate")),
                        EndDate: parseISO($node.attr("ows_EndDate")),
                        Location: $node.attr("ows_Location"),
                        Description: $node.attr("ows_Description"), 
                        fRecurrence: $node.attr("ows_fRecurrence"), 
                        RecurrenceData: $node.attr("ows_RecurrenceData"), 
                        fAllDayEvent: $node.attr("ows_fAllDayEvent")
                    };
                    items = [...items, row];

                });
                
            }
        });
        }
        
        
    }
    
    items.sort((a,b) => {
        if( isBefore(a.EventDate, b.EventDate)){return -1;}
        return 1;
    }) ;

    
    return items;
};

//#endif
