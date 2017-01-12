//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initCanvasMain);
    
    function initCanvasMain() {
        // Create a Paper.js Path to draw a line into it:
        var path = new Path();
        // Give the stroke a color
        path.strokeColor = 'black';
        var start = new Point(100, 100);
        // Move to start and draw a line from there
        path.moveTo(start);
        // Note the plus operator on Point objects.
        // PaperScript does that for us, and much more!
        path.lineTo(start + [ 100, -50 ]);
    };
    
})(jQuery);

