import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { Article } from 'src/app/interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public categories: string[] = ['business','entertainment','general','health','science','sports','technology'];
  public selectedCategory: string = this.categories[6];
  public articles: Article[] = [];

  @ViewChild(IonInfiniteScroll,{static: true}) infiniteScroll!: IonInfiniteScroll;

  constructor(private newsService:NewsService) {}

  ngOnInit() {
      this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe(articles =>{
        this.articles = [...articles]
      })
  }

  segmentChanged(event : any){
    this.selectedCategory = event.detail.value;
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe(articles =>{
        this.articles = [...articles]
      })
  }

  loadData(){
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, true)
    .subscribe(articles=>{

      if(articles.length === this.articles.length){
        this.infiniteScroll.disabled = true;
        //event.target.disabled=true;
        return;
      }
      
      this.articles = articles;
      this.infiniteScroll.complete();
      //event.target.complete()

    })
  }

}
