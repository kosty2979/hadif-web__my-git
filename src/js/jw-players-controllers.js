
  jwplayer("jwplayer").setup({
   file: "http://content.jwplatform.com/videos/HkauGhRi-640.mp4",
   width: "100%",
   aspectratio: "16:9",
   autostart: false,
   repeat: true
  });
  jwplayer("jwplayer-list").setup({
   file: "http://content.jwplatform.com/videos/HkauGhRi-640.mp4",
   width: "100%",
   aspectratio: "16:9",
   autostart: false,
   repeat: true
  });
  jwplayer("jwplayer-remote").setup({
   file: "http://content.jwplatform.com/videos/HkauGhRi-640.mp4",
   width: "100%",
   aspectratio: "16:9",
   autostart: false,
   repeat: false
  });
  // JW Player on Completion
  jwplayer().onComplete(function() {
    alert("Thanks for watching");
  });