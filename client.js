
$(document).ready(function() {
    updateIdea();
    destroyIdea();
    updateQuality();
    filterIdeas();
  $("#create-trigger").click(function() {
    debugger;
    createIdea();
  });
});

function filterIdeas() {
  var titles = document.querySelectorAll(".title-box");
  var bodies = document.querySelectorAll(".body-box");
  var search = document.querySelector("#search-box");
  search.onkeyup = function () {
    var phrase = this.value;
    for (var i = 0; i < titles.length; i++) {
      var text = titles[i].innerHTML + " " + bodies[i].innerHTML;
      var id = extractID(titles[i].id);
      var card = document.querySelector("#card-" + id);
      if (_.includes(text, phrase) !== true) {
        card.style.display = "none";
      } else {
        card.style.display = "";
      }
    }
  };
}

function createIdea() {
  debugger;
  var title = $("#create-title").val();
  var body = $("#create-body").val();
  appendIdea({});
  $("#create-title").val("");
  $("#create-body").val("");
  updateIdea();
  destroyIdea();
  updateQuality();
  filterIdeas();
}

function updateIdea() {
  var updates = document.querySelectorAll(".update-trigger");
  var edit = function() {
    var id = extractID(this.href);
    var title = this.querySelector("#title-" + id);
    var body = this.querySelector("#body-" + id);
    title.contentEditable = true;
    body.contentEditable = true;
    this.onkeypress = function (key) {
      if (key.keyCode === 13) {
        title.contentEditable = false;
        body.contentEditable = false;
        var quality = document.querySelector("#quality-" + id);
        patchIdea(id, quality.innerHTML, title.innerHTML, body.innerHTML);
      }
    };
  };

  for (var i = 0; i < updates.length; i++) {
    updates[i].onclick = edit;
  }
}

function updateQuality() {
  updatePositive();
  updateNegative();
}

function updateNegative() {
  var options = { 0: "bad", 1: "good", 2: "excellent" };
  var downvotes = document.querySelectorAll(".downvote-trigger");
  var downvote = function () {
    var id = extractID(this.id);
    var quality = options[nextQuality(id, -1)];
    document.querySelector("#quality-" + id).innerHTML = quality;
    patchIdea(id, quality);
  };
  for (var i = 0; i < downvotes.length; i++) {
    id = extractID(downvotes[i].id);
    downvotes[i].onclick = downvote;
  }
}

function updatePositive() {
  var options = { 0: "bad", 1: "good", 2: "excellent", 3: "superb" };
  var upvotes = document.querySelectorAll(".upvote-trigger");
  var upvote = function () {
    var id = extractID(this.id);
    var quality = options[nextQuality(id, 1)];
    document.querySelector("#quality-" + id).innerHTML = quality;
    patchIdea(id, quality);
  };
  for (var i = 0; i < upvotes.length; i++) {
    id = extractID(upvotes[i].id);
    upvotes[i].onclick = upvote;
  }
}

function nextQuality(id, modifier) {
  var quality = document.querySelector("#quality-" + id);
  var options = { bad: 0, good: 1, excellent: 2 };
  var change = options[quality.innerHTML] + modifier;
  if (change < 0 || change > 2) {
    return options[quality.innerHTML];
  } else {
    return options[quality.innerHTML] + modifier;
  }
}

function destroyIdea() {
  var deletions = document.querySelectorAll(".delete-trigger");
  var deleteIt = function () {
    var id = extractID(this.id);
    deleteIdea(id);
  };
  for (var i = 0; i < deletions.length; i++) {
    deletions[i].onclick = deleteIt;
  }
}

function deleteIdea(id) {
  removeIdea(id);
  destroyIdea();
}

function patchIdea(id, quality, title, body) {
  overwriteIdea(id, 'Cats!', body);
}

function removeIdea(id) {
  var card = document.querySelector("#card-" + id);
  card.parentNode.removeChild(card);
}

function overwriteIdea(id, title, body) {
  $("#title-" + id).html(title);
  $("#body-" + id).html(body);
}

function extractID(that) {
  return that.split("-")[1];
}

function appendIdea(idea) {
  var content = "<div class='title-box' id=title-" + idea.id + ">" + idea.title + "</div>";
  content = content + "<div class='body-box' id=body-" + idea.id + ">" + idea.body + "</div>";
  $("#all-ideas").append(ideaDiv(idea, content));
}

function ideaDiv(idea, content) {
  var card = document.createElement("div");
  card.className = "card";
  card.id = "card-" + idea.id;

  var buttonHolder = document.createElement("div");
  buttonHolder.className = "card-action";

  var deleteButton = createDeleteButton(idea.id);
  var upvoteButton = createUpvoteButton(idea.id);
  var downvoteButton = createDownvoteButton(idea.id);
  var qualityBox = createQuality(idea.id, idea.quality);

  var link = document.createElement("a");
  link.className = "update-trigger";
  link.href = "#id-" + idea.id;

  var innerIdea = document.createElement("div");
  innerIdea.id = "idea-" + idea.id;
  innerIdea.innerHTML = content;

  link.appendChild(innerIdea);
  buttonHolder.appendChild(qualityBox);
  buttonHolder.appendChild(upvoteButton);
  buttonHolder.appendChild(downvoteButton);
  buttonHolder.appendChild(deleteButton);
  card.appendChild(link);
  card.appendChild(buttonHolder);
  return card;
}

function createQuality(id, quality) {
  var qualityBox = document.createElement("p");
  qualityBox.id = "quality-" + id;
  qualityBox.innerHTML = quality;
  return qualityBox;
}

function createDeleteButton(id) {
  var deleteButton = document.createElement("button");
  deleteButton.id = "delete-" + id;
  deleteButton.className = "delete-trigger btn";
  deleteButton.innerHTML = "Upvote";
  return deleteButton;
}

function createUpvoteButton(id) {
  var upvoteButton = document.createElement("button");
  upvoteButton.id = "upvote-" + id;
  upvoteButton.className = "upvote-trigger btn";
  upvoteButton.innerHTML = "Upvote";
  return upvoteButton;
}

function createDownvoteButton(id) {
  var downvoteButton = document.createElement("button");
  downvoteButton.id = "downvote-" + id;
  downvoteButton.className = "downvote-trigger btn";
  downvoteButton.innerHTML = "Upvote";
  return downvoteButton;
}
