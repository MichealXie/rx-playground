import React, { useEffect, useState, useRef } from 'react';
import { fromEvent, merge, interval, Observable, from, of, Subject } from 'rxjs';
import { tap, map, filter, take, mergeAll, mergeMap } from 'rxjs/operators';
import './App.css';
import { scan } from 'rxjs/operators';
import { audit } from 'rxjs/operators'

// const clicks = fromEvent(document, 'click');
// const result = clicks.pipe(audit(ev => interval(1000)));
// result.subscribe(x => console.log(x));

// fromEvent(document, 'click') // 数据源, 也就是 observable, 使用迭代器模式处理流的信息, 相当于帮你手动调用了 next(e)
//   .pipe(scan(count => count + 1, 0)) // 流, 一般为操作符
//   .subscribe(count => console.log(`Clicked ${count} times`)); // subscribe 里的函数即为 observer 对数据源发出的信息做出反应


// const consoler = new Observable(subscribe => {
//   subscribe.next(2)
//   subscribe.next(2)
//   subscribe.next(2)
//   subscribe.next(2)
//   subscribe.next(2)
//   subscribe.error(3)
// }).subscribe(console.log, console.log)

// 另一种创建方法: 操作符返回一个函数, 参数是 Observable, 一般不这么用
// map(x => x * x)(of(1, 2, 3)).subscribe((v) => console.log(`value: ${v}`));


// const clicks = fromEvent(document, 'click');
// const higherOrder = clicks.pipe(
//   map((ev) => interval(100).pipe(take(5))),
//   mergeAll(),
// ).subscribe(console.log)
// const result = higherOrder.pipe(exhaust());
// result.subscribe(x => console.log(x));

function App() {
  const [todoItems, setTodoItems] = useState([])
  const $inputRef = useRef(null)

  const itemClicked$ = new Subject().subscribe()
  const addClicked$ = new Subject().subscribe()
  const inputEnter$ = new Subject()
    .pipe(
      filter(e => (e.key === 'Enter'))
    )
    .subscribe(console.log)


  useEffect(() => {
    const todoAdd$ = merge(addClicked$, inputEnter$)
      .pipe(
        map(() => $inputRef.current.value),
        filter(name => name),
        map(name => {
          return {
            name,
            done: false,
            id: new Date().valueOf(),
          }
        }),
        scan((acc, todoItem) => {
          return acc.concat(todoItem)
        }, todoItems),
        tap(updatedTodoItems => {
          setTodoItems(updatedTodoItems)
          $inputRef.current.value = ''
        }),
      )

    console.log(todoAdd$);
  })

  return (
    <div className="App">
      <div className="input-area">
        <input type="text" className="todo-val" onChange={ e => inputEnter$.next(e) } ref={$inputRef}/>
        <div className="add-btn" onClick={ e => addClicked$.next(e) }>添加</div>
      </div>
      <ul className="todo-items">
        {
          todoItems.map(item => (
            <li className={`item ${item.done ? 'done' : ''}`} key={item.id} onClick={e => { itemClicked$.next(e) }}>
              {item.name}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default App;
