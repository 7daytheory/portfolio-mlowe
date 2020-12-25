'use strict';

class LogicController() {
    console.log('Logic Controller');

    constructor(title, okEvent, cancelEvent, parent = document.body) {

        this.confirmCallback = okEvent;
        this.cancelCallback = cancelEvent;

        this.dialogElement = document.createElement("div");
        this.dialogElement.classList.add("modal");
        let titleElem = document.createElement("div");
        titleElem.classList.add("topBar");

        let closeBox = document.createElement("div");
        closeBox.classList.add("modalCloseBtn");
        closeBox.innerHTML = "<p>&times;</p>";
        closeBox.addEventListener("click", this.__cancelButtonEvent.bind(this));
        titleElem.appendChild(closeBox);

        let heading = document.createElement('span');
        heading.classList.add("modalTitle");
        heading.innerText = title;
        titleElem.appendChild(heading);

        this.dialogElement.appendChild(titleElem);

        this.content = document.createElement("div");
        this.content.classList.add("modalContent");

        this.confirmButton = document.createElement("button");
        this.confirmButton.innerText = UI_text_translations.logCon7[UI_text_translations.lang];
        this.confirmButton.addEventListener("click", this.__confirmButtonEvent.bind(this));

        this.cancelButton = document.createElement("button");
        this.cancelButton.innerText = UI_text_translations.logCon8[UI_text_translations.lang];
        this.cancelButton.addEventListener("click", this.__cancelButtonEvent.bind(this));

        // sets a lowest htmlelement to use as a ref
        this.divOkCancelGroup = document.createElement('div');
        this.divOkCancelGroup.setAttribute('id', 'button_div');

        this.divOkCancelGroup.appendChild(this.cancelButton);
        this.divOkCancelGroup.appendChild(this.confirmButton);

        this.content.appendChild(this.divOkCancelGroup);

        this.dialogElement.appendChild(this.content);
    }

    doModal()
    {
      let background = document.getElementById("WQModalBkgnd");
      if (background!==null)
    {
      siteUI.sharedinstance.SetModalBackground(true,0.4);
      background.appendChild(this.dialogElement);
      this.dialogElement.style.display = "block";
      siteUI.sharedinstance.SetActiveDialog(this);
    }
  }

    /** Adds an element to dialog.
    *
    * @param {HTMLElement} elem
    */
   addHTMLElement(elem, classList=[], eventType="", eventHandler=null, parentElem=null)
   {
       if (classList!==null)
       {
         for (let i = 0; i<classList.length; i++)
         {
           elem.classList.add(classList[i]);
         }
       }

       if (parentElem===null)
       {
         this.content.insertBefore(elem, this.divOkCancelGroup);
       }
       else
       {
         parentElem.appendChild(elem);
       }

       if ((typeof eventType)=='string' && eventType.length!=0 && eventHandler!=null)
       {
         elem.addEventListener(eventType,eventHandler);
       }
   }

   /** Add Heading to the Dialog.
    *
    * @param {String} text The text to show in the heading.
    */
   addHeading(text)
   {
     let heading = document.createElement('h3');
     if (heading!=null)
     {
       heading.innerText = text;
       this.addHTMLElement(heading);
     }
   }

   /** Adds a Label to a given HTMLElement, or the default this.dialogElement
    *
    * @param {string} text The text of the label to add
    * @param {HTMLElement} [elem] The HTMLElement to add the label object to
    */
   addLabel(id, text, classList=[], elem=null)
   {
     let label = document.createElement('label');
     if (label!=null)
     {
       label.innerText = text;
       if (id.length)
       {
         label.id = id;
       }
       this.addHTMLElement(label, classList, null, null, elem);
     }
   }

   /** Adds a Button to a given HTMLElement
    *
    * @param {string} text The text inside of the button
    */
   addButton(text, classList=[], eventHandler=null, elem=null)
   {
     let button = document.createElement('button');
     if (button!=null)
     {
       button.innerText = text;
       this.addHTMLElement(button, classList, null, null, elem);

       if (eventHandler!=null)
       {
         button.addEventListener("click",eventHandler);
       }
     }
   }

   /** Add a break element.
    *
    * @param {HTMLElement} elem
    */
   addBreak(elem=null)
   {
       this.addHTMLElement(document.createElement('br'), null, null, null, elem);
   }

   /** Adds a numeric dropdown menu containing a given pattern of integers
    *
    * startnum and endnum are inclusive
    *
    */
   addNumericDropDown(id, name, startnum, endnum, step, curval=null, classListArray=[], eventHandler=null, parentElem=null)
   {
     var Success = true;
     var Found = false;
     let selectElem = document.createElement('select');

     Success = (selectElem!=null);

     selectElem.id = id;

     let val = startnum;
     while (Success && val<=endnum)
     {
       if (curval!==null && curval==val)
       {
         Found = true;
       }
       let option = document.createElement('option');
       Success = option!=null;

       if (Success)
       {
         option.setAttribute('value', val);
         option.innerText = val;
         selectElem.appendChild(option);
       }

       val += step;
     }

     if (Success)
     {
       this.addLabel("", name, classListArray);
       this.addHTMLElement(selectElem, null, 'change', eventHandler, parentElem);
       this.addBreak();
     }

     if (Success)
     {
       if (Found && curval!==null)
       {
         selectElem.value = curval;
       }
       else
       {
         //put an empty, unselectable option at the beginning of the list, but select it to
         //give the impression that nothing is selected
         if (selectElem.childNodes.length!=0)
         {
           let option = document.createElement('option');
           option.setAttribute('value','');
           selectElem.insertBefore(option,selectElem.childNodes[0]);
           option.setAttribute('disabled','');
           option.setAttribute('selected','');
         }
       }
     }
   }

   /** Adds a Slider to a given HTMLElementt
    *
    * @param {string} name The text label for the slider
      @param {int} minnum The Minimum number in the slider
      @param {int} maxnum The Maximum number in the slider
      @param {int} step The slider goes by multiples of [step]
    */
   addSlider(id, name, minnum, maxnum, step, value, classListArray=[], eventHandler=null, parentElem=null)
   {
     let slider = document.createElement('input');
     slider.type = "range";
     slider.min = minnum;
     slider.max = maxnum;
     slider.value = value;
     slider.step = step;
     slider.id = id;
     if (slider!=null)
     {
       slider.innerText = name;
       this.addLabel("", name, [], parentElem);
       this.addHTMLElement(slider, classListArray, null, eventHandler, parentElem);
     }
   }

   /** Adds a dropdown containing strings
    *
    * options array must contain objects with members called 'descriptor' and 'value'
    * to be included as choices in select element
    */
   addStringDropDown(id, name, options, curval=null, classListArray=[], eventHandler=null, parentElem=null)
   {
     var Success = true;
     var Found = false;
     let selectElem = document.createElement('select');

     Success = (selectElem!=null);

     selectElem.id = id;

     let i = 0;
     while (Success && i<options.length)
     {
       if (((typeof options[i].descriptor)=='string') && ((typeof options[i].value)=='string'))
       {
         if (curval!==null && options[i].value===curval)
         {
           Found = true;
         }

         let option = document.createElement('option');
         Success = option!=null;

         if (Success)
         {
           option.setAttribute('value', options[i].value);
           option.innerText = options[i].descriptor;
           selectElem.appendChild(option);
         }
       }

       i++;
     }

     if (Success)
     {
       this.addLabel("", name, classListArray);
       this.addHTMLElement(selectElem, null, 'change', eventHandler, parentElem);
       this.addBreak();
     }

     if (Success)
     {
       if (Found && curval!==null)
       {
         selectElem.value = curval;
       }
       else
       {
         //put an empty, unselectable option at the beginning of the list, but select it to
         //give the impression that nothing is selected
         if (selectElem.childNodes.length!=0)
         {
           let option = document.createElement('option');
           option.setAttribute('value','');
           selectElem.insertBefore(option,selectElem.childNodes[0]);
           option.setAttribute('disabled','');
           option.setAttribute('selected','');
         }
       }
     }
   }

   /** Adds a Checkbox with a given name and label to the parentElem
    *
    * @param {string} name
    * @param {string} label
    * @param {HTMLElement} [parentElem]
    */
   addCheckBox(id, label, value, eventHandler=null, parentElem=null)
   {
     var Success = true;

     let checkBox = document.createElement('input');
     Success = (checkBox !== null)

     if (Success)
     {
       checkBox.id = id;
       checkBox.type = 'checkbox';
       checkBox.checked = value;
       this.addHTMLElement(checkBox, null, 'click', eventHandler, parentElem);
       this.addLabel("", label, null);
     }

     return(Success);
   }

   /** Adds a single-line text control with a given name and label to the parentElem
    *
    * @param {string} name
    * @param {string} label
    * @param {HTMLElement} [parentElem]
    */
   addTextControl(id, label, value, classList=[], eventHandler=null, parentElem=null)
   {
     var Success = true;

     let textControl = document.createElement('input');
     Success = (textControl !== null)

     if (Success)
     {
       textControl.id = id;
       textControl.type = 'text';
       textControl.value = value;
       if (label.length)
       {
         this.addLabel("", label, null);
         this.addBreak();
       }
       this.addHTMLElement(textControl, classList, 'click', eventHandler, parentElem);
     }

     return(Success);
   }


   /**
    * The function that is called when the ok button is pressed
    * @returns {void}
    */
   __confirmButtonEvent(e) {
       e.stopPropagation();
       if (this.confirmCallback!=null)
       {
         if(this.confirmCallback(this))
         {
           this.removeDialog();
         }
       }
   }

   /**
    * @returns {void}
    */
   __cancelButtonEvent(e) {
       e.stopPropagation();
       this.removeDialog();
       if (this.cancelCallback!=null)
       {
         this.cancelCallback();
       }
   }

   /**
    * Removes the dialog from the DOM
    * @author Owen Anderson
    *
    * @returns {void}
    */
   removeDialog() {
       WDQUI.sharedinstance.SetActiveDialog(null);
       WDQUI.sharedinstance.SetModalBackground(false,0.0);
       this.dialogElement.remove();
   }
}
