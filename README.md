```mermaid
erDiagram
    users {
        integer id PK
        text name
        text googleUserId
        integer backgroundId FK
        integer createdAt
        integer updatedAt
    }

    tarotSpreads {
        integer id PK
        text name
        text description
        integer createdAt
        integer updatedAt
    }

    tarotSpreadPositions {
        integer id PK
        integer spreadId FK
        integer no
        integer x
        integer y
        text description
        text displayName
        text orientation
        integer createdAt
        integer updatedAt
    }

    tarotCards {
        integer id PK
        text name
        text description
        text uprightMeaning
        text reversedMeaning
        integer createdAt
        integer updatedAt
    }

    tarotDrawHistory {
        integer id PK
        integer userId FK
        integer spreadId FK
        text concern
        integer drawDate
        integer createdAt
        integer updatedAt
    }

    tarotDrawCards {
        integer id PK
        integer drawHistoryId FK
        integer cardId FK
        integer position
        text positionStatus
        text orientation
        integer drawOrder
        integer createdAt
        integer updatedAt
    }

    tarotCardBackgrounds {
        integer id PK
        text name
        text filePath
    }

    tarotReadingResults {
        integer id PK
        integer drawHistoryId FK
        text modelName
        text errorMessage
        text readingResult
        text followUpQuestion
        integer createdAt
        integer updatedAt
    }

    users ||--o{ tarotDrawHistory : "has"
    tarotSpreads ||--o{ tarotDrawHistory : "uses"
    tarotSpreads ||--o{ tarotSpreadPositions : "defines"
    tarotDrawHistory ||--o{ tarotDrawCards : "contains"
    tarotCards ||--o{ tarotDrawCards : "includes"
    tarotCardBackgrounds ||--o{ users : "chooses"
    tarotDrawHistory ||--o{ tarotReadingResults : "produces"
```