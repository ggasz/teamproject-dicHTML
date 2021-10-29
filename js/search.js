const query = document.getElementById('search')
const submitBtn = document.getElementById('submit')
const container = document.getElementById('container')
const autocomplete = document.getElementById('autocomplete')
const BASE_URL = 'http://localhost:5000/api/dics';

 function checkIfStringHasSpecialCharacter(str) {
     const re = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
     return re.test(str);
 }

 function checkIfStringHasNumbers(str) {
     return /\d/.test(str);
 }        

 function checkIfStringHasLetters(str) {
     return /[a-z]/i.test(str);
 }        

 function queryIn(str) {
    query.value = str;
 }  

// 서버 데이터 가져오기
function getData(baseUrl, query){
     submitBtn.disabled = true // 버튼 비활성화
    //console.log(query)
    if(query){
         if(checkIfStringHasSpecialCharacter(query)){
                 container.innerHTML = "your search keyword has Special Character. Retype only hangle! "
                 return;
         }

         if(checkIfStringHasNumbers(query)){
                 container.innerHTML = "your search keyword has Numbers. Retype only hangle! "
                 return;
         }

         if(checkIfStringHasLetters(query)){
                 container.innerHTML = "Retype only hangle! "
                 return;
         }
     }        

    fetch(`${baseUrl}/${query}`, {
         headers: {
             "Content-Type": "application/json",
         }
    })
    .then( res => res.json())
    .then( data => {
         submitBtn.disabled = false // 버튼활성화
         console.log(data)

         const {words} = data;

         if(words.length === 0){
             container.innerHTML = "No Words Found!"
             return;
         }

         const template = words.map(word => {
             if(word.r_seq == undefined){
                 word.r_seq = "" 
             }
             return (
                 `
                     <div class="card border-primary mb-3 w-100">
                     <h5 class="card-header"><a href="${word.r_link}" target="_blank">${word.r_word}<sup>${word.r_seq}</sup></a> ${word.r_chi}</h5>
                     <div class="card-body">
                         <p class="card-text">${word.r_des}</p>
                     </div>
                     <div class="card-footer text-muted">
                         ${word.r_pos}
                     </div>  
                     </div>

                 `
             )
         })
         container.innerHTML = template.join("")                
     })
 }

//  function getAuto(baseUrl, query){
//     console.log(query)
//     if(checkIfStringHasNumbers(query) || checkIfStringHasSpecialCharacter(query) || checkIfStringHasLetters(query)){
//         return;
//     }       

//    fetch(`${baseUrl}/auto/${query}`, {
//         headers: {
//             "Content-Type": "application/json",
//         }
//    })
//    .then( res => res.json())
//    .then( data => {
//         console.log(data)

//         const {words} = data;

//         if(words.length === 0){
//             autocomplete.innerHTML = ""
//             return;
//         } 

//         const template = words.map(word => {
//             return (
//                 `
//                     <div>
//                     <a href="#" onclick="queryIn('${word}'); return false;">${word}</a>  
//                     </div>

//                 `
//             )
//         })
//         autocomplete.innerHTML = template.join("")                
//     })
// }
submitBtn.addEventListener('click', function(){
     console.log(query.value)
     getData(BASE_URL, query.value)
})
query.addEventListener('keyup',function(e){
    if(e.keyCode === 13){
        getData(BASE_URL, query.value)
    }
})       
window.addEventListener('DOMContentLoaded', function() { 
     getData(BASE_URL)
});

$(function () {
    $("#search").autocomplete({
        source : function(request, response) {
            $.ajax({
                url : BASE_URL+"/auto/"+$("#search").val()
                , dataType: "json"
                , success : function(data){ // 성공
                    const {words} = data;
                    response(
                        words.map(word => {
                            return {
                                label : word    //목록에 표시되는 값
                                , value : word   //선택 시 input창에 표시되는 값
                            };
                        })
                    );    //response
                }
                ,
                error : function(){ //실패
                    alert("통신에 실패했습니다.");
                }
            });
        }
        // ,
        // maxResults: 10,
        // source: function(request, response) {
        // var results = $.ui.autocomplete.filter(src, request.term);
        // response(results.slice(0, this.options.maxResults));
        // }

        , minLength : 1    
        , autoFocus : false
        , response: function(event, ui) {
            //console.log(ui);
        }       
        , select : function(evt, ui) {
            //console.log("전체 data: " + JSON.stringify(ui));
            //console.log("검색 데이터 : " + ui.item.value);
        }
        , focus : function(evt, ui) {
            return false;
        }
        , close : function(evt) {
        }
    })  
});