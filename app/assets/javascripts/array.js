var buildColorArray = function(parentDiv){

  var generateDivs = function(parentDiv, colorArray){
    var $parentDiv = $(parentDiv)
    colorArray.map(function(item){
      $parentDiv.append("<div class='colored-box' style='background-color: " + item + "'></div>")
    })

  }

  var generateColorArray = function(){
    var bezInterpolator = chroma.bezier(['white', 'yellow', 'red', 'black'])
    var numericalArray = [0, 0.33, 0.66, 1]
    var colorArray = numericalArray.map(function(item){
      return bezInterpolator(item).hex()
    })
    return colorArray
  }

  var colorArray = generateColorArray()

  generateDivs(parentDiv, colorArray)


}

$(document).ready(function(){
  buildColorArray('body')
})
