(function () {
    "use strict";

    var currentDate = new Date();
    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    loadData();

    WinJS.Namespace.define("Data", {
        getDate: getDate,
        reload: reload,
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveGroupReferenceByTitle: resolveGroupReferenceByTitle,
        resolveItemReference: resolveItemReference
    });

    function getDate() {
        return currentDate;
    }

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }
    
    // Get the unique group corresponding to the provided group key.
    function resolveGroupReferenceByTitle(title) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).title === title) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }
    
    var parseData = function (data, group) {
        var text = data.parse.text['*'];
        var entries = onthisday.extractEntries(text);
        var items = [];
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            items.push({
                group: group,
                title: entry.year,
                subtitle: '',
                description: entry.description,
                content: '',
                backgroundImage: null,
                links: entry.links
            });
        }
        return items;
    };
    
    function reload(date) {
        currentDate = date;
        list = new WinJS.Binding.List();
        loadData(date);
    }

    function loadData(date) {
        if (!date) {
            date = currentDate;
        }
        date = onthisday.formatDate(date);
        
        var groups = [
            { key: "group1", title: "Highlights", backgroundImage: null, description: 'Highlights' },
            { key: "group2", title: "Events", backgroundImage: null, description: 'Events' },
            { key: "group3", title: "Births", backgroundImage: null, description: 'Births' },
            { key: "group4", title: "Deaths", backgroundImage: null, description: 'Deaths' }
        ];

        var promises = [
            onthisday.getHighlights(date).then(function (data) {
                return parseData(data, groups[0]);
            }),
            onthisday.getEvents(date).then(function (data) {
                return parseData(data, groups[1]);
            }),
            onthisday.getBirths(date).then(function (data) {
                return parseData(data, groups[2]);
            }),
            onthisday.getDeaths(date).then(function (data) {
                return parseData(data, groups[3]);
            })
        ];

        WinJS.Promise.join(promises).done(function (data) {
            // now push items into the list
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].length; j++) {
                    list.push(data[i][j]);
                }
            }
        });
    }
})();
