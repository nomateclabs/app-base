import { x } from '../modules/xscript.mjs';
import { xdata } from '../data/xdata.mjs';
import { router } from '../modules/jsnode.mjs';
import { tpl } from './tpl.mjs';
import { utils } from '../modules/utils.mjs';
import { ls } from '../modules/storage.mjs';

const xviews = {
  build(app_main){

    let toTop = x('div', {
      class: 'totop ico hidden',
      onclick: function(){
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    }, 'keyboard_arrow_up')

    let item = x('main-view',
      tpl.sidebar(router),
      x('div', {id: 'main'},
        tpl.topbar(router),
        app_main
      ),
      tpl.toast(),
      toTop
    )

    window.addEventListener('scroll', utils.debounce(function(evt){
       let top = window.pageYOffset || document.scrollTop;
       if(top === NaN || !top){
         toTop.classList.add('hidden');
       } else if(toTop.classList.contains('hidden')){
         toTop.classList.remove('hidden');
       }
       top = null;
       return;
    }, 250))

    return item
  },
  error(stream, data){
    return x('code', stream.js(data))
  },

  //views
  dashboard(stream, data){

    let item;

    if(detach.dashboard){
      console.log('hit')
      item = detach.dashboard;
    } else {

      console.log('no hit')




    }

    return item;
  },
  database(stream, data){
    return x('p', data.msg)
  },
  lists(stream, data){

    let sel = x('select', {class: 'form-select', multiple: '' })

    db.get('list', function(err, doc) {
      if(err){return console.error(err)}
      for (let i = 0; i < doc.data.length; i++) {
        sel.append(x('option', {
          value: i,
          onclick(){
            ls.set('current', doc.data[i].name);
            let evt = new CustomEvent('toasty', {detail: {data: doc.data[i].name + ' Active', sel: 'success'}});
            window.dispatchEvent(evt);
          }
        }, doc.data[i].name))
      }
    });

    let item = x('div',
      x('div', {class: 'mt-4'},
        sel
      ),

      x('div', {class: 'mt-4 btn-group w-100', role: 'group'},
        x('button', {
          class: 'btn btn-primary',
          type: 'button',
          'data-bs-toggle': 'modal',
          'data-bs-target': '#request',
          onclick(){

          }
        }, 'Add'),
        x('button', {
          class: 'btn btn-primary',
          type: 'button',
          'data-bs-toggle': 'modal',
          'data-bs-target': '#confirm',
          onclick(){

          }
        }, 'Remove')
      ),
      tpl.confirm('Delete existing list?',function(res){
        if(res){
          let current = ls.get('current'),
          evt;

          if(current === 'default'){
            evt = new CustomEvent('toasty', {detail: {data: 'cannot delete default list', sel: 'danger'}});
            window.dispatchEvent(evt);
            return
          }

          if(current === ''){
            evt = new CustomEvent('toasty', {detail: {data: 'No list selected', sel: 'danger'}});
            window.dispatchEvent(evt);
            return
          }

          db.get('list', {force: true}, function(err, doc) {
            if(err){return console.error(err)}
            for (let i = 0; i < doc.data.length; i++) {
              if(doc.data[i].name === current){
                doc.data.splice(i,1)
              }
            }

            db.put({
              _id: 'list',
              _rev: doc._rev,
              data: doc.data
            }, function(err, response) {
              if(err){
                evt = new CustomEvent('toasty', {detail: {data: 'list not deleted', sel: 'danger'}});
                window.dispatchEvent(evt);
                return console.log(err);
              }
              evt = new CustomEvent('toasty', {detail: {data: 'list deleted', sel: 'success'}});
              window.dispatchEvent(evt);
              utils.udhref();
            });

          })

        }
      }),
      tpl.mdl('New list name',function(res){
        console.log(res)
        let exists = false;

        db.get('list', {force: true}, function(err, doc) {
          if(err){return console.error(err)}
          console.log(doc)
          let evt;
          for (let i = 0; i < doc.data.length; i++) {
            if(doc.data[i].name === res){
              exists = true;
            }
          }

          if(exists){
            evt = new CustomEvent('toasty', {detail: {data: 'list exists', sel: 'danger'}});
            return window.dispatchEvent(evt);
          }

          doc.data.push({
            name: res,
            items: []
          });

          db.put({
            _id: 'list',
            _rev: doc._rev,
            data: doc.data
          }, function(err, response) {
            if(err){ return console.log(err);}
            evt = new CustomEvent('toasty', {detail: {data: 'list created', sel: 'success'}});
            window.dispatchEvent(evt);
            utils.udhref();
          });

        });

      })

    );

    return item;
  },
  settings(stream, data){
    let item = x('div', x('p', data.msg));

    return item;
  },
  contact(stream, data){
    return tpl.contact();
  },
  about(stream, data){
    let item = x('div', x('p', data.msg));

    return item;
  }
}

export { xviews }
