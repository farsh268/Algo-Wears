const INITIAL_STATE = {

sections : [ 
         {
            title: 'hats',
            imageUrl : 'https://media.gq.com/photos/5a04f9a398002d2e253679f5/master/pass/fall-hats-gq-style-0816-01-1.jpg',
            id : 1,
            linkUrl : 'shop/hats'
        },
        {
        title : 'jackets',
        imageUrl : 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
               id : 2,
               linkUrl : 'shop/jackets'    
        },
        {
           title : 'sneakers',
           imageUrl : 'https://images.unsplash.com/photo-1612902376491-7a8a99b424e8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
           id : 3,
           linkUrl : 'shop/sneakers'
        },
        {
           title: 'belts',
           imageUrl: 'https://media.istockphoto.com/photos/collection-of-leather-belts-on-a-wooden-table-picture-id1029383076?k=20&m=1029383076&s=612x612&w=0&h=TDOmHuEBOHX2t7wFQgBZzpCrp0YDbGK3RRjfiCs4vak=',
           size: 'large',
            id: 4,
          linkUrl: 'shop/belts'
        },
         {
            title: 'eyeglasses',
            imageUrl: 'https://media.istockphoto.com/photos/youve-got-to-see-it-to-believe-it-picture-id1305313808?b=1&k=20&m=1305313808&s=170667a&w=0&h=j9-94X1snyej8Ftnnv8osmBMjINFGirRlFdrg6pumqY=',
           size: 'large',
            men : 'last',
            id: 5,
            linkUrl: 'shop/eyeglasses'
  
        }
        ]
     };

     const directoryReducer = (state = INITIAL_STATE, action) => {
        switch(action.type) {
           default :
            return state;
        }
     }

     export default directoryReducer;

