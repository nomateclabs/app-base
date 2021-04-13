import { x } from '../modules/xscript.mjs';
import { xdata } from '../data/xdata.mjs';
import { utils } from '../modules/utils.mjs';
import { ls,ss } from '../modules/storage.mjs';

const tpl = {
  sidebar(router){

    let item = x('div', {id: 'sidebar', class: ''},
      x('div', {class: 'sidebar-wrapper'},
        x('div', {class: 'sidebar-header'},
          x('h3', xdata.app.name)
        ),
        x('div', {class: 'sidebar-menu'},
          function(){
            let lst = x('ul', {class: 'menu'},
              x('li', {class: 'sidebar-title'}, 'Menu'),
            ),
            items = xdata.app.menu.sb

            for (let i = 0; i < items.length; i++) {
              lst.append(tpl.sb_link(items[i], router))
            }

            items = null;

            return lst;
          }
        ),
        x('div', {
            class: 'sidebar-toggler btn x',
            onclick(){
              let event = new Event('toggle-sidebar');
              window.dispatchEvent(event);
            }
          },
          x('i', {class: 'ico-cancel'})
        )
      )
    )

    window.addEventListener('toggle-sidebar', function (e) {
      item.classList.toggle('active')
    }, false);

    return item
  },
  sb_link(obj, router){

    let item = x('div', {class: 'sidebar-item'},
      x('div', {
          class: 'sidebar-link',
          onclick(){
            router.rout('/'+ obj.dest);
            let event = new Event('toggle-sidebar');
            window.dispatchEvent(event);
          }
        },
        x('span', obj.title),
        x('span', {class: 'text-right w-100 ico-right-open'})
      )
    )
    return item;
  },
  topbar(router){

    let item = x('nav', {class: 'navbar navbar-header navbar-expand navbar-light'},
      x('div', {
          class: 'sidebar-toggler',
          onclick(){
            let event = new Event('toggle-sidebar');
            window.dispatchEvent(event);
          }
        },
        x('span', {class: 'navbar-toggler-icon cp'}),
      ),
      x('div', {class: 'title-text'}, 'Barcode scanner')
    )

    return item;
  },
  theme(){
    let ico = x('i', {class: 'ico'}),
    darkstyle = x('link', {href: './app/css/dark.css', rel: 'stylesheet'}),
    item = x('li', {
        class: 'nav-icon dropdown cp',
        onclick(evt){
          if(ls.get('darkmode')){
            ls.set('darkmode', false);
          } else {
            ls.set('darkmode', true);
          }
          window.dispatchEvent(new CustomEvent('dark-mode', {detail:true}));
        }
      },
      x('a', {class: 'nav-link nav-link-lg nav-link-user'},
        x('div', {class: 'd-lg-inline-block'}, ico)
      )
    )

    window.addEventListener('dark-mode', function (evt) {
      console.log('hit')
      if(!ls.get('darkmode')){
        darkstyle.remove()
        ico.textContent = 'brightness_7';
      } else {
        document.head.append(darkstyle)
        ico.textContent = 'brightness_4';
      }
    }, false);




    return item;
  },
  contact(){
    let item = x('div',
      x('div', {class: 'card mb-4 text-center'},
        x('div', {class: 'card-body'},
          x('h3', 'Contact'),
          x('div', {class: 'row'},
            x('div', {class: 'col-12 col-md-6'},
              x('div', {class: 'mt-4 form-group'},
                x('label', 'name'),
                x('input', {class: 'form-control', type: 'text'})
              )
            ),
            x('div', {class: 'col-12 col-md-6'},
              x('div', {class: 'mt-4 form-group'},
                x('label', 'email'),
                x('input', {
                  class: 'form-control',
                  type: 'email'
                })
              )
            ),
            x('div', {class: 'col-12'},
              x('div', {class: 'mt-4 form-group'},
                x('label', 'message'),
                x('textarea', {class: 'form-control', rows: 8})
              )
            )
          ),
          x('div', {class: 'mt-4 mb-4'},
            x('button', {
              type: 'button',
              class: 'btn btn-outline-success float-right',
              onclick(){
                utils.addSpin(this);
              }
            },'Send')
          )

        )
      )
    )

    return item;
  },
  toast(){

    let item = x('div', {class: 'toast-box'});

    window.addEventListener('toasty', function(evt){
      let ele = tpl.toasty(evt.detail);
      setTimeout(function(){
        ele.classList.add('fadeOutRightBig');
        setTimeout(function(){
          ele.remove();
        },1000)
      },5000)
      item.append(ele)
    })

    return item;

  },
  toasty(obj){
    let ele = x('div', {
        class: 'toast d-flex align-items-center text-white bg-'+ obj.sel +' border-0 ani fadeInUp'
      },
      x('div', {class: 'toast-body'}, obj.data)
    )

    return ele
  },
  mdl(txt, fn){

    let inp = x('input', {
      class: 'form-control',
      type: 'text',
      placeholder: ''
    }),
    cls = x('button', {
      class: 'btn btn-primary',
      type: 'button',
      'data-bs-dismiss': 'modal',
      'aria-label': 'close'
    }, 'Close'),
    item = x('div', {class: 'modal', id: 'request'},
      x('div', {class: 'modal-dialog modal-xl'},
        x('div', {class: 'modal-content'},
          x('div', {class: 'modal-body'},
            x('div', {class: 'container-fluid'},
              x('label', {class: 'form-label'}, txt),
              inp
            ),
            x('div', {class: 'error'})
          ),
          x('div', {class: 'modal-footer'},
            cls,
            x('button', {
              class: 'btn btn-primary',
              type: 'button',
              onclick(){
                let val = inp.value;
                if(val){
                  fn(val);
                  inp.value = '';
                  return cls.click();
                }

                let evt = new CustomEvent('toasty', {detail: {data: 'Invalid input', sel: 'danger'}});
                window.dispatchEvent(evt);

              }
            }, 'Ok')
          )
        )
      )
    )
    return item;
  },
  confirm(txt, fn){

    let cls = x('button', {
      class: 'btn btn-primary',
      type: 'button',
      'data-bs-dismiss': 'modal',
      'aria-label': 'close'
    }, 'No'),
    item = x('div', {class: 'modal', id: 'confirm'},
      x('div', {class: 'modal-dialog modal-xl'},
        x('div', {class: 'modal-content'},
          x('div', {class: 'modal-body'},
            x('div', {class: 'container-fluid'},
              x('h5', {class: 'text-center'}, txt)
            )
          ),
          x('div', {class: 'modal-footer justify-content-between'},
            cls,
            x('button', {
              class: 'btn btn-primary',
              type: 'button',
              onclick(){
                fn(true);
                return cls.click();
              }
            }, 'Yes')
          )
        )
      )
    )
    return item;
  },
  detach(cb){

    let mdl_close = x('span', {
        class: 'ico-cancel float-right',
        type: 'button',
        'data-bs-dismiss': 'modal',
        'aria-label': 'close'
      }
    ),
    mymodal = x('div', {class: 'modal', id: 'livestream_scanner'},
      x('div', {class: 'modal-dialog modal-xl'},
        x('div', {class: 'modal-content'},
          x('div', {class: 'modal-header'},
            x('h4', {class: 'modal-title'}, 'Barcode Scanner'),
            mdl_close
          ),
          x('div', {class: 'modal-body'},
            x('div', {class: 'container-fluid'},
              x('div', {id: 'interactive', class: 'viewport'},
                x('div', {class: 'diode'},
                  x('div', {class: 'laser'})
                )
              )
            ),
            x('div', {class: 'error'})
          ),
          x('div', {class: 'modal-footer'},
            x('button', {
              class: 'btn btn-primary',
              type: 'button',
              'data-bs-dismiss': 'modal',
              'aria-label': 'close'
            }, 'Close')
          )
        )
      )
    ),
    item = x('app-main',
      x('div', {class: 'container'},
        x('div', {class: 'row'},
          x('div', {class: 'col-lg-12'},
            x('div', {class: 'input-group'},
              x('input', {
                id: 'scanner_input',
                class: 'form-control',
                placeholder: 'Click the button to scan an item',
                type: 'text'
              }),
              x('button', {
                  class: 'btn btn-outline-primary',
                  type: 'button',
                  'data-bs-toggle': 'modal',
                  'data-bs-target': '#livestream_scanner'
                }, 'Scan'
              )
            ),
            x('div', {class: 'mt-4 btn-group w-100', role: 'group'},
              x('button', {
                class: 'btn btn-primary',
                type: 'button',
                onclick(){

                }
              }, 'Add'),
              x('button', {
                class: 'btn btn-primary',
                type: 'button',
                onclick(){

                }
              }, 'Edit'),
              x('button', {
                class: 'btn btn-primary',
                type: 'button',
                onclick(){

                }
              }, 'Remove'),
            )

          )
        ),
        mymodal
      )
    )



      // Create the QuaggaJS config object for the live stream
      var liveStreamConfig = {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            aspectRatio: { min: 1, max: 100 },
            facingMode: 'environment' // or 'user' for the front camera
          }
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency
          ? navigator.hardwareConcurrency
          : 4,
        decoder: {
          readers: [{ format: 'ean_reader', config: {} }]
        },
        locate: true
      };

      // Start the live stream scanner when the modal opens
      mymodal.addEventListener('shown.bs.modal', function(e) {
        Quagga.init(liveStreamConfig, function(err) {
          if (err) {return console.error(err)
            Quagga.stop();
            return;
          }
          Quagga.start();
        });
      });

      mymodal.addEventListener('hide.bs.modal', function() {
        if (Quagga) {
          Quagga.stop();
        }
      });

      // Make sure, QuaggaJS draws frames an lines around possible
      // barcodes on the live stream
      Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              parseInt(drawingCanvas.getAttribute('width')),
              parseInt(drawingCanvas.getAttribute('height'))
            );
            result.boxes
              .filter(function(box) {
                return box !== result.box;
              })
              .forEach(function(box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: '#20ec39',
                  lineWidth: 4
                });
              });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: '#20ec39',
              lineWidth: 4
            });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: 'x', y: 'y' },
              drawingCtx,
              { color: 'red', lineWidth: 4 }
            );
          }
        }
      });

      // Once a barcode had been read successfully, stop quagga and
      // close the modal after a second to let the user notice where
      // the barcode had actually been found.
      Quagga.onDetected(function(result) {
        if (result.codeResult.code) {
          console.log(result.codeResult.code)
          document.getElementById('scanner_input').value = result.codeResult.code;

          Quagga.stop();
          setTimeout(function() {

            mdl_close.click()

          }, 1000);
        }
      });



      detach.dashboard = item;

      cb()

  }
}

export { tpl }
