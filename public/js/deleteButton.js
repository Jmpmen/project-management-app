const deleteBtn = document.getElementById('deleteButton')
const deleteModal = document.getElementById('deleteModal')
const cancelModal = document.getElementsByClassName('cancel')

deleteBtn.addEventListener('click', deleteModalToggle)
Array.from(cancelModal).forEach(element => element.addEventListener('click', deleteModalToggle))


function deleteModalToggle(){
    deleteModal.classList.toggle('hidden')
    deleteModal.classList.toggle('flex')
}