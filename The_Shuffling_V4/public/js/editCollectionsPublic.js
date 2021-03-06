async function handleAdd(event) {
  let id = event.target.id.trim();
	console.log(id);
  await axios
    .post("addCards/", { id: id })
    .then(response => {
      let card = response.data.card;
      // add element to DOM
      let tr = $("<tr></tr>")
        .addClass("card-in-list")
        .addClass(card.id);
      $("<td></td>")
        .append(card.name)
        .attr("title", "Refresh page to see image.")
        .appendTo(tr);
      $("<td></td>")
        .append(card.convertedManaCost)
        .appendTo(tr);
      $("<td></td>")
        .append(card.rarity)
        .appendTo(tr);
      let btn = $("<button></button>")
        .addClass("fas fa-minus-circle btn btn-sm btn-outline-danger")
        .attr("id", card.id)
        .attr("onclick", "handleDelete(event)");
      $("<td></td>")
        .append(btn)
        .appendTo(tr);
      $("#added-cards").append(tr);
    })
    .catch(err => console.log(err));
}

async function handleDelete(event) {
  let id = event.target.id.trim();
  // remove element from DOM
  $("." + event.target.id.trim()).remove();
  // remove from server array
  axios
    .post("removeCards/", { id: id })
    .then(() => {
      console.log("remove successful");
    })
    .catch(err => console.log(err));
}

async function handleReset(event) {
  let containerName = event.target.id.trim();
  await axios
    .post("reset/", {containerName:containerName})
    .then(() => {
      if("<%$(containerName).length  == 0%>") {
        console.log("Reset Successfull");
        location.reload();
    }})
    .catch((err) => console.log(err));
}

async function handleAcceptChanges() {
	console.log("About to make changes.")
  await axios
    .put("/collection/<%= currentUser.cardcollection.id %>/subgroup/<%= subgroup._id%>/acceptChanges")
    .then(() => {
      alert("Success! Cards have been added!");
    })
    .catch(err => console.log(err))
  location.reload();
}

function showHideLoader() {
  $(".loader").addClass("show");
}

$(document).ready( () => {
  $(() => {
      $('[data-toggle="tooltip"]').tooltip();
  })
})
