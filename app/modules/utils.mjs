import { x } from './xscript.mjs';

const utils = {
  format_date: function(i){
    let date = new Date(i),
    dd = date.getDate(),
    mm = date.getMonth()+1,
    yyyy = date.getFullYear();

    if(dd < 10){
      dd = '0' + dd
    }

    if(mm < 10){
      mm = '0' + mm
    };

    return [dd, mm, yyyy].join('-')
  },
  get(url, cb){

    fetch(url, {
      method: 'GET'
    })
    .then(function(res){
      console.log(res)

      if(res.status > 199 && res.status < 300){
        return res.json().then(function(data){
          cb(false, data);
        });
      }

      throw res.status
    })
    .catch(function(err){
      cb(err)
    });

  },
  onload(){

    window.onload = function() {

      //resize
      let w = window.innerWidth;
      if(w < 768) {
          console.log('widthnya ', w);
          document.getElementById('sidebar').classList.remove('active');
      }

      //darkmode check
      window.dispatchEvent(new CustomEvent('dark-mode', {detail:false}));

      window.dispatchEvent(new CustomEvent('toasty', {detail:{sel: 'primary', data: 'test toast!'}}));
    }

  },
  addSpin(dest){
    let item = x('div', {class:'spinner-grow spinner-grow-sm ml-2', role:'status'})
    dest.append(item);
    setTimeout(function(){
      item.remove();
    },2000)
  },
  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      let context = this, args = arguments,
      later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      },
      callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow){
        func.apply(context, args);
      }
    }
  },
  capitalize(str) {
   try {
     let x = str[0] || str.charAt(0);
     return x  ? x.toUpperCase() + str.substr(1) : '';
   } catch (err) {
     if(err){return str;}
   }
  },
  is_email(email){
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
     return true;
    }
    return false;
  },
  is_letters(txt){
    if(txt.match(/^[A-Za-z]+$/)){
      return true;
    }
    return false;
  },
  is_alphanumeric(txt){
    if(txt.match(/^[0-9a-zA-Z]+$/)) {
      return true;
    }
    return false;
  },
  snake_case(str){
    try {
      return str.replace(/ /g, '_');
    } catch (err) {
      if(err){return str;}
    }
  },
  un_snake_case(str){
    try {
      return str.replace(/_/g, ' ');
    } catch (err) {
      if(err){return str;}
    }
  },
  udhref(){
    let href = location.href.split('?')[0]
    href += '?time='+ Date.now();
    location.href = href;
  }
}

export { utils }
