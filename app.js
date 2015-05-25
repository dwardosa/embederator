 /**
 * Module dependencies.
 */


 /* Need to create methods which consume a URL and then decides what scrapper method to call (Which will be in a new file)   
 *  
 */
 
var express = require('express')
  , request = require('request')
  , url = require('url')
  , Crawler = require('crawler')
  , http = require('http')
  , path = require('path')
  , queryString = require('querystring');
;
 
var app = express();
 
  // Setting port app listens on
  app.set('port', process.env.PORT || 8081);

   var URL = 'https://www.youtube.com/user/SMBHvideos/videos';

   var playlistURL = "https://www.youtube.com/playlist?list=PLJB3pCQPlLA2b5L-LITpRljEpE-4BglPz";

 // List all the videos information 
app.get('/infoAllVideos', function(req, res){

    var videos = [];

    var crawler = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, result, $) {
            // $ is Cheerio by default

            if(error)
            {
                    console.log('Error scrapping');
            }
             
             //Iterating through each video div 
            $('.yt-lockup-dismissable').each(function(i, elem) {
                console.log("Video detected ..." + i);

                var video = {};

                //Storing video title in obj
                $(this).find('.yt-uix-tile-link').each(function(i, elem){
                  if(i == 0)
                  {
                    video['title'] = $(this).attr('title');
                    console.log('Detected video title: ' + video['title']);
                  }
                    
                });

                //Storing video thumb and url in obj
                $(this).find('.yt-uix-sessionlink').each(function(i, elem){
                  if(i == 0)
                  {
                    video['url'] = 'https://www.youtube.com' + $(this).attr('href');

                    // Constructing thumbnail URL f
                    var indexOfEquals = $(this).attr('href').indexOf('=');
                    var videoId = $(this).attr('href').slice(indexOfEquals+1);
                    video['thumb'] = 'https://img.youtube.com/vi/' + videoId + '/0.jpg';

                    console.log('Detected video url: ' + video['url'] + ' video thumb: ' + video['thumb']);
                  }
                    
                });

                // Storing view count and age in obj              
                $(this).find('.yt-lockup-meta-info').each(function(){

                  $(this).find('li').each(function(i, item){

                    if(i == 0)
                    {
                      video['views'] = $(this).text();
                      console.log('Views: ' + video['views']);
                    }
                    if(i == 1)
                    {
                      video['age'] = $(this).text();
                      console.log('Age: ' + video['age']);
                    }

                  });

                });

                //Storing video length in obj
                $(this).find('.video-time').each(function(){

                  $(this).find('span').each(function(){
                    video['fullLength'] = $(this).attr('title');
                    video['shortLength'] = $(this).text();
                    console.log('Time full format: ' + video['fullLength'] + ' short format: ' + video['shortLength']);
                  });

                });

                //Store video object in array
                videos[i] = video;

            });
          
         }
       ,
        onDrain : function(){
          //Function for finished scrapping
           console.log('Finished scrapping');

           outputText = "";

           // Looping through the Videos and conacting a string for output to HTML response
           for(i=0; i < videos.length; i++)
           {
              video = videos[i];
              outputText += '<h1> Video ' + i + '</h1>';
              outputText += ' <b>Detected video title:</b> ' + video['title'];
              outputText += '<br/> <b>Detected video url: </b>' + video['url'] + '<br/> <b>video thumb:</b> ' + video['thumb'];
              outputText +=  '<br/> <b>Views:</b> ' + video['views'];
              outputText += '<br/> <b>Age: </b>' + video['age'];
              outputText += '<br/> <b>Views: </b>' + video['views'] + '<br></br>';
           }

           console.log('Output: ' + outputText);

           res.send('Output: ' + outputText);
        }
    });

    // Queue just one URL, with default callback
    crawler.queue(URL);

});


app.get('/embeddedAllPlaylistVideos', function(req, res){

    var videos = [];

    var crawler = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, result, $) {
            // $ is Cheerio by default

            if(error)
            {
                    console.log('Error scrapping');
            }
             
             //Iterating through each video div 
            $('.pl-video').each(function(i, elem) {
                console.log("Video detected ..." + i);

                var video = {};

                //Storing video thumb and url in obj
                $(this).find('.pl-video-title-link').each(function(i, elem){
                  if(i == 0)
                  {
                    // Start of the string to extract, first character after the = sign
                    start = $(this).attr('href').indexOf('=') + 1;
                    // Stop at the character just before the amphersand, which joins the two GET variables
                    stop = $(this).attr('href').indexOf('&');

                    // Store the value of the v= GET variable, start at one character after first instance of =
                    video['youTubeVideoParam'] = $(this).attr('href').substring(start,stop);
                    // Storing video title
                    video['title'] = $(this).text();
 
                    console.log('Detected video url: ' + video['youTubeVideoParam'] + ' Title" ' + video['title']);
                  }
                    
                });

                //Store video object in array
                videos[i] = video;

            });
          
         }
       ,
        onDrain : function(){
          //Function for finished scrapping
           console.log('Finished scrapping');

          // Creating HTML list
           outputHTML = '<div id="nodeTubeEmbed"><ul>';

           // Looping through the Videos and conacting a string for output to HTML response
           for(i=0; i < videos.length; i++)
           {
              video = videos[i];

              outputHTML += '<li><h2> ' + video['title'] + '</h2><iframe width="640" height="360" src="https://www.youtube.com/embed/' + video['youTubeVideoParam'] + '" frameborder="0" allowfullscreen></iframe></li>'

           }

           // Ending the HTML list.
           outputHTML += '</ul></div>';

           console.log('Output: ' + outputHTML);

           res.send('Output: ' + outputHTML);
        }
    });

    // Queue just one URL, with default callback
    crawler.queue(playlistURL);

});


app.get('/embeddedAllVideos', function(req, res){

    var videos = [];

    var crawler = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, result, $) {
            // $ is Cheerio by default

            if(error)
            {
                    console.log('Error scrapping');
            }
             
             //Iterating through each video div 
            $('.yt-lockup-dismissable').each(function(i, elem) {
                console.log("Video detected ..." + i);

                var video = {};

                //Storing video thumb and url in obj
                $(this).find('.yt-uix-sessionlink').each(function(i, elem){
                  if(i == 0)
                  {
                    // Store the value of the v= GET variable, start at one character after first instance of =
                    video['youTubeVideoParam'] = $(this).attr('href').substring($(this).attr('href').indexOf('=')+1);

                    console.log('Detected video url: ' + video['youTubeVideoParam']);
                  }
                    
                });

                //Store video object in array
                videos[i] = video;

            });
          
         }
       ,
        onDrain : function(){
          //Function for finished scrapping
           console.log('Finished scrapping');

          // Creating HTML list
           outputHTML = '<div id="nodeTubeEmbed"><ul>';

           // Looping through the Videos and conacting a string for output to HTML response
           for(i=0; i < videos.length; i++)
           {
              video = videos[i];

              outputHTML += '<li><iframe width="640" height="360" src="https://www.youtube.com/embed/' + video['youTubeVideoParam'] + '" frameborder="0" allowfullscreen></iframe></li>'

           }

           // Ending the HTML list.
           outputHTML += '</ul></div>';

           console.log('Output: ' + outputHTML);

           res.send('Output: ' + outputHTML);
        }
    });

    // Queue just one URL, with default callback
    crawler.queue(URL);

});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

