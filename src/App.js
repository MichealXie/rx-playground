import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { fromEvent, merge, interval, Observable, from, of, Subject } from 'rxjs';
import { tap, map, filter, take, mergeAll, mergeMap, flatMap, switchMap, takeUntil, debounceTime, retry, mapTo} from 'rxjs/operators';
import './App.css';
import { scan } from 'rxjs/operators';
import { audit } from 'rxjs/operators'

function App() {
  const [recommendItems, setRecommendItems] = useState([])
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const $input = document.querySelector('.input')
    // 自动完成
    fromEvent($input, 'keydown').pipe(
      debounceTime(250),
      switchMap(e => {
        const value = $input.value
        if (!value) return from([])
        return from(axios.get(`http://127.0.0.1:7001/fe_api/burdock/v1/search/recommend?keyword=${value}`))
      }),
      map(res => (res.data.data)),
      tap(setRecommendItems)
    ).subscribe(console.log)

    // 点击搜索
    const $recommendItems = document.querySelector('.recommend-items')

    fromEvent($recommendItems, 'click', false).pipe(
      filter(e => (e.target.nodeName === 'LI')),
      map(e => e.target.innerHTML),
      tap(keyword => {
        $input.value = keyword
        setRecommendItems([])
      }),
      flatMap(keyword => (from(axios.get(`http://127.0.0.1:7001/fe_api/burdock/v1/search/note?keyword=${keyword}`)))),
      map(res => (res.data.data.notes)),
      tap(setSearchResults),
    ).subscribe(console.log)

  }, [recommendItems, searchResults])

  return (
    <div className="App">
      <input type="text" className="input"/>
      <div className="recommend-items">
        {
          recommendItems.map(item => (
            <li className="recommend-item" key={item.text + item.type} >
              {item.text}
            </li>
          ))
        }
      </div>
      <div className="search-result">
        {
          searchResults.map(item => (
            <div className="">
              <img className="note-cover" src={item.cover.url} alt="" />
              <li className="search-result">
                {item.title}
              </li>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
