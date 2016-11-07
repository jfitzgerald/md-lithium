##Overview
text

##Pre-requisites

* [XYZ Account]
* [XYZ Pixel ID]
* [Client ID]

##Tag Library Versions

TIP: It's reccomended to stay up to date with the latest versions!
* [v4]
* [v3]
* [v2] 

#How to implement
##Step 1. Add The Tag
This Tag is available in Tealium's `Tag Marketplace`. Refer to the Tags Tab article to learn how to add a Tag to your Tealium iQ profile.

NOTE: This is only a sample output of the MD >> Lithium Styled HTML.

PRE: var myStringArray = ["Hello","World"];
var arrayLength = myStringArray.length;
for (var i = 0; i < arrayLength; i++) {
    alert(myStringArray[i]);
    //Do something
}

[insert screenshot of Tag being added from the Tag Marketplace]

##Step 2. Configure the settings##

1. Title: Enter a unique name to identify the Tag. This is important if you are adding multiple instances of this Tag.

2. [Param XYZ]: [insert description here]

3. [Dropdown XYZ]: [insert description here] 
  * [sub-list item #1]: [insert description].
  * [sub-list item #1]: [insert description]. 

##Step 3. Apply Load Rules##
[Load Rules](https://cxommunity.tealiumiq.com/t5/Getting-Started/Load-Rules-Creation/ta-p/9422) determine when and where to load an instance of this Tag on your site. The 'Load on All Pages' rule is the default Load Rule. To load this Tag on a specific page, create relevant Rule conditions to apply to the Tag.

##Best Practice [insert text].

##Step 4. Set up Data Mappings##

Mapping is the simple process of sending data from a data source, in your Data Layer, to the matching destination variable of the vendor Tag. The destination variables for this Tag are available in the Data Mapping toolbox and are grouped in different categories for ease of use.

**For instructions on how to map a Data Source to a Tag destination, see [Mapping Data Sources](https://community.tealiumiq.com/t5/Tealium-iQ-Tag-Management/Variable-Types-formerly-Data-Sources/ta-p/10645#mapping_data_sources)**

**[Category #1]**

**Destination Name**  | **Description**
------------- | -------------
destination #1| Description
destination #2| Description

**[Category #2]**

**Destination Name**  | **Description**
------------- | -------------
destination #1| Description
destination #2| Description

##E-Commerce
[Map to these destinations for sending ecommerce–specific Data Layer variables. We typically recommend using [Tealium's E-Commerce Extension](https://community.tealiumiq.com/t5/Tealium-iQ-Tag-Management/E-Commerce-Extension-Installation-and-Setup/ta-p/11927) for this purpose. Why? When it is properly configured, the Extension automatically maps your variables to the appropriate destinations for all E-Commerce enabled Tags in your profile. That way you don't have to map those variables over and over for every one of your Tag. If you, however, decide to override any Extension variable, or otherwise your variables are not available to the Extension, you must manually map a data source to its destination using the toolbox.]

**Destination Name**  | **Description**| **E-Commerce Extension (RECOMMENDED**
------------- | -------------|---
[Order ID]   | Description  |["_corder" maps to this destination]
[Sub Total]| Description  | ["_csubtotal" maps to this destination]

##Events##
Map to these destinations for triggering specific events on a page.[insert description as needed.]

Here's how to map an event:

1. Select an event from the dropdown list. You may choose from the pre-defined list or create a 'Custom' event.
For 'Custom' event, enter a name with which to identify it.
2. In the 'Trigger' field, enter the value of the Data Source you are mapping to this destination. When the value is found, the event will trigger on the page.
3. To map more events, click the + button and repeat steps #1 and #2.
4. Click 'Apply'.
[insert screenshot]

##Step 5. Save and publish

That's it! You have successfully set up the Tag in your profile.

[insert screenshot here]

#Vendor Documentation

[insert doc link]
[insert doc link]
[insert doc link]