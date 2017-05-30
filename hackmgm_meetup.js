var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var addLeadingZero = function (num) {
    return (num < 10) ? ('0' + num) : num;
};
var getFormattedDate = function (millis) {
    var date = new Date(millis);
    return months[date.getMonth()] + ' ' + addLeadingZero(date.getDate()) + ', ' + date.getFullYear().toString();
};
var getFormattedTime = function (millis) {
    var time = new Date(millis),
        hours = time.getHours(),
        min = time.getMinutes(),
        ampm = (hours > 11) ? 'PM' : 'AM';
    min = (min < 10) ? ('0' + min) : min;
    hours = (hours == 0) ? 1 : hours;
    hours = (hours > 12) ? hours - 12 : hours;
    return hours + ':' + min + ' ' + ampm;
};
var numberFormat = function (nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    return x1 + x2;
};

function handleException(request, message,
                         error) {
    var msg = "";
    msg += "Code: " + request.status + "\n";
    msg += "Text: " + request.statusText + "\n";
    if (request.responseJSON != null) {
        msg += "Message" +
            request.responseJSON.Message + "\n";
    }
    alert(msg);
}

function eventBuildTableRow(event) {

    var ret =
        '<div class="media">' +
        '<div class="media-left media-middle">' +
        '<span class="glyphicon glyphicon-calendar"></span>' +
        '</div>' +
        '<div class="media-body">' +
        '<h4 class="media-heading">' + getFormattedDate(event.time) + '&nbsp;' + getFormattedTime(event.time) + '</h4>' +
        '<h5><a target="_blank" href="' + event.event_url + '">' + event.name + '</a></h5>' +
        '</div>' +
        '</div>';
    console.log(ret);
    return ret;
}

function eventAddRow(event) {
    //   console.log(event);
    // Check if <tbody> tag exists, add one if not
    if ($("#upcomingList tbody").length == 0) {
        $("#upcomingList").append("<tbody></tbody>");
    }
    // Append row to <table>
    $("#upcomingList").append(
        eventBuildTableRow(event));
}

function eventListSuccess(events) {
    console.log(events.results);
    // Iterate over the collection of data
    $.each(events.results, function (index, event) {
        // Add a row to the Product table
        eventAddRow(event);
    });
}

function upcomingEvents() {
    // Call Web API to get a list of Product
    $.ajax({
        url: 'https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=hackMGM&photo-host=public&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=2762521&sig=7247cf51b0fc8de4161591c7a36cb5672a89aced',
        type: 'GET',
        dataType: 'jsonp',
        success: function (events) {
            eventListSuccess(events);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}


function groupStatsSuccess(stats) {
//console.log(stats.results[0]);
    console.log(stats.results[0].members);
    console.log(stats.results[0].who);
    console.log(stats.results[0].description);

    if ($("#meetup-stats").length == 0) {
// do nothing
        console.log("error with meetup-stats");
    }
    else {

        // Append row to <table>
        $("#meetup-stats").append(
            '<p>' + stats.results[0].description + '</p>' +
            '<div class="lead">' + stats.results[0].members + '&nbsp;' + stats.results[0].who + '</div>' +
            '<p><a class="btn btn-danger btn-md joinus" target="_blank" href="' + stats.results[0].link + '" role="button">Join Us &raquo;</a></p>'
        );
    }

}

function groupStats() {
    // Call Web API to get a list of Product
    $.ajax({
        url: 'https://api.meetup.com/2/groups?offset=0&format=json&group_urlname=hackmgm&photo-host=public&page=20&radius=25.0&fields=&order=id&desc=false&sig_id=2762521&sig=16892790d4bbc81b4f4c02be002e220d3b036f42',
        type: 'GET',
        dataType: 'jsonp',
        success: function (group_stats) {
            groupStatsSuccess(group_stats);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}
