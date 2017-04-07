var page = new WebPage();
var url = 'http://localhost/a-search-form';
var stepIndex = 0;

/**
 * From PhantomJS documentation:
 * This callback is invoked when there is a JavaScript console. The callback may accept up to three arguments: 
 * the string for the message, the line number, and the source identifier.
 */
page.onConsoleMessage = function (msg, line, source) {
    console.log('console> ' + msg);
};

/**
 * From PhantomJS documentation:
 * This callback is invoked when there is a JavaScript alert. The only argument passed to the callback is the string for the message.
 */
page.onAlert = function (msg) {
    console.log('alert!!> ' + msg);
};

// Callback is executed each time a page is loaded...
page.open(url, function (status) {
  if (status === 'success') {
    // State is initially empty. State is persisted between page loads and can be used for identifying which page we're on.
    console.log('============================================');
    console.log('Step "' + stepIndex + '"');
    console.log('============================================');

    // Inject jQuery for scraping (you need to save jquery-1.6.1.min.js in the same folder as this file)
    page.injectJs('jquery-1.6.1.min.js');

    // Our "event loop"
    if(!phantom.state){
      initialize();
    } else {
      phantom.state();
    } 

    // Save screenshot for debugging purposes
    page.render("step" + stepIndex++ + ".png");
  }
});

// Step 1
function initialize() {
  page.evaluate(function() {
    $('form#search input.query').val('Jebus saves');
    $('form#search').submit();
    console.log('Searching...');
  });
  // Phantom state doesn't change between page reloads
  // We use the state to store the search result handler, ie. the next step
  phantom.state = parseResults; 
}

// Step 2
function parseResults() {
  page.evaluate(function() {
    $('#search-result a').each(function(index, link) {
      console.log($(link).attr('href'));
    });
    console.log('Parsed results');
  });
  // If there was a 3rd step we could point to another function
  // but we would have to reload the page for the callback to be called again
  phantom.exit(); 
}
