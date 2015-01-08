(function(Modules) {
  "use strict";
  Modules.DowntimeMessage = function() {
    this.start = function(element) {

      var $startTimeFields = element.find('.js-start-time select'),
          $stopTimeFields  = element.find('.js-stop-time select'),
          $downtimeMessage = element.find('.js-downtime-message'),
          $scheduleMessage = element.find('.js-schedule-message');

      element.on('change', 'select', updateMessages);
      updateMessages();

      function updateMessages() {

        var startDate = getDateFromFields($startTimeFields),
            stopDate = getDateFromFields($stopTimeFields);

        $downtimeMessage.val(downtimeMessage(startDate, stopDate));
        $scheduleMessage.text(scheduleMessage(startDate));
      }

      function getDateFromFields(fields) {
        var year,
            month,
            day,
            hours,
            minutes,
            date;

        fields.each(function(i) {
          var value = parseInt($(this).val(), 10);

          switch(i) {
            case 4:
              year = value;
              break;
            case 3:
              month = value - 1;
              break;
            case 2:
              day = value;
              break;
            case 1:
              minutes = value;
              break;
            case 0:
              hours = value;
              break;
            }
        });

        date = new Date(year, month, day, hours, minutes);
        return moment(date);
      }

      function downtimeMessage(startDate, stopDate) {
        var message = "This service will be unavailable from ",
            startTime = getTime(startDate),
            startDay = getDay(startDate),
            stopTime = getTime(stopDate),
            stopDay = getDay(stopDate),
            sameDay = isSameDay(startDate, stopDate);

        if (!isValidSchedule(startDate, stopDate)) {
          return '';
        }

        if (sameDay) {
          message = message + startTime + ' to ' + stopTime + ' on ' + startDay + '.';
        } else {
          message = message + startTime + ' on ' + startDay
            + ' to ' + stopTime + ' on ' + stopDay + '.';
        }

        return message;
      }

      function scheduleMessage(startDate) {
        var message = "A downtime message will show from ",
            beginShowingDate = startDate.clone().subtract(1, 'day'),
            beginTime = getTime(beginShowingDate),
            beginDay = getDay(beginShowingDate);

        return message + beginTime + ' on ' + beginDay + ' (one day before the downtime)';
      }

      function isSameDay(startDate, stopDate) {
        // Treat a midnight stop date as being on the same day as
        // the hours before it. eg
        // Unavailable from 10pm to midnight on Thursday 8 January
        return startDate.isSame(stopDate.clone().subtract(1, 'minute'), 'day');
      }

      function getTime(moment) {
        var time = moment.format('h:mma');
        return time.replace(/:00/, '').replace(/12am/, 'midnight').replace(/12pm/, 'midday');
      }

      function getDay(moment) {
        var day = moment.format('dddd D MMMM');
        return day;
      }

      function isValidSchedule(startDate, stopDate) {
        return !startDate.isSame(stopDate) && !stopDate.isBefore(startDate);
      }
    }
  };
})(window.GOVUKAdmin.Modules);
