import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import * as CryptoJS from 'crypto-js'

@Component({
  selector: 'app-cipher-page',
  templateUrl: './cipher-page.component.html',
  styleUrls: ['./cipher-page.component.scss']
})
export class CipherPageComponent implements OnInit {

  ngOnInit() {$(() => {
    const body = $('body'),
      stage = $('#stage'),
      back = $('a.back');

    /* Step 1 */

    $('#step1 .encrypt').on('click',() => {
      body.attr('class', 'encrypt');

      // Go to step 2
      step(2);
    });
    $('#step1 .decrypt').on('click',() => {
      body.attr('class', 'decrypt');
      step(2);
    });


    /* Step 2 */


    $('#step2 .cipher-button').on('click', function() {
      // Trigger the file browser dialog
      $(this).parent().find('input').click();
    });


    // Set up events for the file inputs

    let file = null;

    $('#step2').on('change', '#encrypt-input', function(e){

      // Has a file been selected?

      if(e.target.files.length!==1){
        alert('Будь ласка виберіть файл для зашифрування');
        return false;
      }

      file = e.target.files[0];

      if(file.size > 1024*1024){
        alert('Будь ласка виберіть файл розміром до 1Мб');
        return;
      }

      step(3);
    });

    $('#step2').on('change', '#decrypt-input', function(e){

      if(e.target.files.length!==1){
        alert('Будь ласка виберіть файл для розшифрування');
        return false;
      }

      file = e.target.files[0];
      step(3);
    });


    /* Step 3 */


    $('a.cipher-button.process').on('click', function() {

      let input = $(this).parent().find('input[type=password]'),
        a = $('#step4 a.download'),
        password = input.val();

      input.val('');

      if(password.length<5){
        alert('Будь ласка, вкажіть пароль довжиною більше 5-ти символів');
        return;
      }

      // The HTML5 FileReader object will allow us to read the
      // contents of the	selected file.

      let reader:any = new FileReader();

      if(body.hasClass('encrypt')){

        // Encrypt the file!

        reader.onload = function(e){

          // Use the CryptoJS library and the AES cypher to encrypt the
          // contents of the file, held in e.target.result, with the password

          let encrypted = CryptoJS.AES.encrypt(e.target.result, password);

          // The download attribute will cause the contents of the href
          // attribute to be downloaded when clicked. The download attribute
          // also holds the name of the file that is offered for download.

          a.attr('href', 'data:application/octet-stream,' + encrypted);
          a.attr('download', file.name + '.encrypted');

          step(4);
        };

        // This will encode the contents of the file into a data-uri.
        // It will trigger the onload handler above, with the result

        reader.readAsDataURL(file);
      }
      else {

        // Decrypt it!

        reader.onload = function(e){

          let decrypted = CryptoJS.AES.decrypt(e.target.result, password)
            .toString(CryptoJS.enc.Latin1);

          if(!/^data:/.test(decrypted)){
            alert("Невірний пароль доступу");
            return false;
          }

          a.attr('href', decrypted);
          a.attr('download', file.name.replace('.encrypted',''));

          step(4);
        };

        reader.readAsText(file);
      }
    });


    /* The back button */


    back.on('click', function() {

      // Reinitialize the hidden file inputs,
      // so that they don't hold the selection
      // from last time

      $('#step2 input[type=file]').replaceWith(function(){
        return $(this).clone();
      });

      step(1);
    });


    // Helper function that moves the viewport to the correct step div

    function step(i){

      if(i === 1){
        back.fadeOut();
      }
      else{
        back.fadeIn();
      }

      // Move the #stage div. Changing the top property will trigger
      // a css transition on the element. i-1 because we want the
      // steps to start from 1:

      stage.css('top',(-(i-1)*100)+'%');
    }
  });


  }

}
