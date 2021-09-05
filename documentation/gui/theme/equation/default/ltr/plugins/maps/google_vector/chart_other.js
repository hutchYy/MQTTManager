(function() {
    google.charts.load('upcoming', {'packages':['geochart']});
    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {

      var data = google.visualization.arrayToDataTable([
        ['Country', 'Popularity'],
        ['Germany', 200],
        ['United States', 300],
        ['Brazil', 400],
        ['Canada', 500],
        ['France', 600],
        ['RU', 700]
      ]);

      var options = {
        colorAxis: {colors: App.getLayoutColorCode("primary_blue2")},
      };

      var chart = new google.visualization.GeoChart(document.getElementById('chart_geo'));
      chart.draw(data, options);
    }
    
    // Resize chart -----------------------
    $(function () {

        // Resize chart on sidebar width change and window resize
        $(window).on('resize', resize);
        $(".sidebar-control").on('click', resize);

        // Resize function
        function resize() {
            drawRegionsMap();
        }
    });
    
})();

