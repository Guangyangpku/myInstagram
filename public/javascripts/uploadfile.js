$(function(){
  function readURL(input) {

      if (input.files && input.files[0]) {
          console.log(input.files);
          var reader = new FileReader();

          reader.onload = function (e) {
              $('#blah').attr('src', e.target.result);
          }

          reader.readAsDataURL(input.files[0]);
      }
  };

  $("#imgInp").change(function(){
      readURL(this);
      document.getElementById("blah").removeAttribute('hidden');

  });
})
