const fetchWorkDetails = async (workKey) => {
  try {
    const workResponse = await fetch(`https://openlibrary.org/works/${workKey}.json`);
    const workData = await workResponse.json();
    
    let ratingsData = null;
    try {
      const ratingsResponse = await fetch(`https://openlibrary.org/works/${workKey}/ratings.json`);
      ratingsData = await ratingsResponse.json();
    } catch (err) {
      console.log('Ratings non disponibili');
    }
    
    return {
      description: typeof workData.description === 'string' 
        ? workData.description 
        : workData.description?.value || '',
      subjects: workData.subjects || [],
      firstSentence: typeof workData.first_sentence === 'string'
        ? workData.first_sentence
        : workData.first_sentence?.value || '',
      rating: ratingsData?.summary?.average || null,
      ratingCount: ratingsData?.summary?.count || 0,
      covers: workData.covers || [],
      links: workData.links || []
    };
  } catch (err) {
    console.error('Errore nel recuperare i dettagli del work:', err);
    return {
      description: '',
      subjects: [],
      firstSentence: '',
      rating: null,
      ratingCount: 0,
      covers: [],
      links: []
    };
  }
};

export const searchOpenLibrary = async (query) => {
  try {
    if (/^[0-9-]{10,}$/.test(query.replace(/\s/g, ''))) {
      const isbn = query.replace(/[-\s]/g, '');
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      );
      const data = await response.json();
      const key = `ISBN:${isbn}`;
      
      if (data[key]) {
        const book = data[key];
        
        let workDetails = {
          description: '',
          subjects: [],
          firstSentence: '',
          rating: null,
          ratingCount: 0,
          covers: [],
          links: []
        };
        
        if (book.url) {
          const workKey = book.url.split('/works/')[1];
          if (workKey) {
            workDetails = await fetchWorkDetails(workKey);
          }
        }
        
        return [{
          title: book.title,
          subtitle: book.subtitle || '',
          authors: book.authors?.map(a => a.name).join(', ') || 'Autore sconosciuto',
          isbn: isbn,
          isbn13: book.identifiers?.isbn_13?.[0] || '',
          isbn10: book.identifiers?.isbn_10?.[0] || isbn,
          cover: book.cover?.large || book.cover?.medium || book.cover?.small || 
                 `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
          publisher: book.publishers?.[0]?.name || '',
          publishDate: book.publish_date || '',
          year: book.publish_date ? book.publish_date.match(/\d{4}/)?.[0] || '' : '',
          pages: book.number_of_pages || null,
          description: workDetails.description,
          firstSentence: workDetails.firstSentence,
          subjects: book.subjects?.slice(0, 15).map(s => s.name) || workDetails.subjects.slice(0, 15) || [],
          rating: workDetails.rating,
          ratingCount: workDetails.ratingCount,
          weight: book.weight || '',
          languages: book.languages?.map(l => l.key.replace('/languages/', '')).join(', ') || '',
          links: workDetails.links,
          workUrl: book.url || '',
          olid: book.identifiers?.openlibrary?.[0] || '',
          goodreads: book.identifiers?.goodreads?.[0] || '',
          librarything: book.identifiers?.librarything?.[0] || ''
        }];
      }
    }
    
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
    );
    const data = await response.json();
    
    const booksWithDetails = await Promise.all(
      data.docs.slice(0, 10).map(async (doc) => {
        let workDetails = {
          description: '',
          subjects: [],
          firstSentence: '',
          rating: null,
          ratingCount: 0,
          covers: [],
          links: []
        };
        
        if (doc.key) {
          const workKey = doc.key.replace('/works/', '');
          workDetails = await fetchWorkDetails(workKey);
        }
        
        return {
          title: doc.title,
          subtitle: doc.subtitle || '',
          authors: doc.author_name?.join(', ') || 'Autore sconosciuto',
          isbn: doc.isbn?.[0] || '',
          isbn13: doc.isbn?.find(i => i.length === 13) || '',
          isbn10: doc.isbn?.find(i => i.length === 10) || '',
          cover: doc.cover_i 
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
            : 'https://via.placeholder.com/300x450?text=No+Cover',
          publisher: doc.publisher?.[0] || '',
          publishDate: doc.publish_date?.[0] || '',
          year: doc.first_publish_year || '',
          pages: doc.number_of_pages_median || null,
          description: workDetails.description,
          firstSentence: workDetails.firstSentence,
          subjects: doc.subject?.slice(0, 15) || workDetails.subjects.slice(0, 15) || [],
          rating: workDetails.rating,
          ratingCount: workDetails.ratingCount,
          languages: doc.language?.join(', ') || '',
          workUrl: doc.key ? `https://openlibrary.org${doc.key}` : '',
          olid: doc.edition_key?.[0] || '',
          hasFulltext: doc.has_fulltext || false,
          editionCount: doc.edition_count || 0
        };
      })
    );
    
    return booksWithDetails;
  } catch (error) {
    console.error('Errore ricerca OpenLibrary:', error);
    return [];
  }
};

export const getBookDetails = async (isbn) => {
  try {
    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );
    const data = await response.json();
    const key = `ISBN:${isbn}`;
    
    if (data[key]) {
      const book = data[key];
      
      let workDetails = {
        description: '',
        subjects: [],
        firstSentence: '',
        rating: null,
        ratingCount: 0,
        covers: [],
        links: []
      };
      
      if (book.url) {
        const workKey = book.url.split('/works/')[1];
        if (workKey) {
          workDetails = await fetchWorkDetails(workKey);
        }
      }
      
      return {
        title: book.title,
        subtitle: book.subtitle || '',
        authors: book.authors?.map(a => a.name).join(', ') || 'Autore sconosciuto',
        isbn: isbn,
        isbn13: book.identifiers?.isbn_13?.[0] || '',
        isbn10: book.identifiers?.isbn_10?.[0] || isbn,
        cover: book.cover?.large || book.cover?.medium || book.cover?.small || 
               `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
        publisher: book.publishers?.[0]?.name || '',
        publishDate: book.publish_date || '',
        year: book.publish_date ? book.publish_date.match(/\d{4}/)?.[0] || '' : '',
        pages: book.number_of_pages || null,
        description: workDetails.description,
        firstSentence: workDetails.firstSentence,
        subjects: book.subjects?.slice(0, 15).map(s => s.name) || workDetails.subjects.slice(0, 15) || [],
        rating: workDetails.rating,
        ratingCount: workDetails.ratingCount,
        weight: book.weight || '',
        languages: book.languages?.map(l => l.key.replace('/languages/', '')).join(', ') || '',
        links: workDetails.links,
        workUrl: book.url || '',
        olid: book.identifiers?.openlibrary?.[0] || '',
        goodreads: book.identifiers?.goodreads?.[0] || '',
        librarything: book.identifiers?.librarything?.[0] || ''
      };
    }
    
    return null;
  } catch (error) {
    console.error('Errore recupero dettagli libro:', error);
    return null;
  }
};
