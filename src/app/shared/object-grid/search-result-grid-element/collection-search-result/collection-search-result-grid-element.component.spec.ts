import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { NormalizedObjectBuildService } from '../../../../core/cache/builders/normalized-object-build.service';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { CommunityDataService } from '../../../../core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../core/data/dso-change-analyzer.service';
import { Collection } from '../../../../core/shared/collection.model';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { UUIDService } from '../../../../core/shared/uuid.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { CollectionSearchResultGridElementComponent } from './collection-search-result-grid-element.component';

let collectionSearchResultGridElementComponent: CollectionSearchResultGridElementComponent;
let fixture: ComponentFixture<CollectionSearchResultGridElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => observableOf(true),
};

const mockCollectionWithAbstract: CollectionSearchResult = new CollectionSearchResult();
mockCollectionWithAbstract.hitHighlights = {};
mockCollectionWithAbstract.indexableObject = Object.assign(new Collection(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description'
      }
    ]
  }
});

const mockCollectionWithoutAbstract: CollectionSearchResult = new CollectionSearchResult();
mockCollectionWithoutAbstract.hitHighlights = {};
mockCollectionWithoutAbstract.indexableObject = Object.assign(new Collection(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Test title'
      }
    ]
  }
});

describe('CollectionSearchResultGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionSearchResultGridElementComponent, TruncatePipe ],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockCollectionWithAbstract) },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: NormalizedObjectBuildService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(CollectionSearchResultGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollectionSearchResultGridElementComponent);
    collectionSearchResultGridElementComponent = fixture.componentInstance;
  }));

  describe('When the collection has an abstract', () => {
    beforeEach(() => {
      collectionSearchResultGridElementComponent.dso = mockCollectionWithAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).not.toBeNull();
    });
  });

  describe('When the collection has no abstract', () => {
    beforeEach(() => {
      collectionSearchResultGridElementComponent.dso = mockCollectionWithoutAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).toBeNull();
    });
  });
});
