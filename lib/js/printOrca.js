function printOrca() {
  var wrapper = $("#wrapper");
  var toggled = "toggled";
  if (!wrapper.hasClass(toggled)) {
    wrapper.addClass("toggled");
  }
  window.print();
}
