// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Form, FormControl, Button, ListGroup } from "react-bootstrap";
// import { Search } from "react-bootstrap-icons";
// import axios from "axios";
// import { API_URL } from "../../config/apiConfig";

// const SearchBox = () => {
//   const [keyword, setKeyword] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   // 🔎 Fetch live suggestions from backend
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (keyword.length < 2) {
//         setSuggestions([]);
//         setShowDropdown(false);
//         return;
//       }

//       try {
//         const { data } = await axios.get(`${API_URL}/api/search/`, {
//           params: {
//             search: keyword,
//             ordering: "-created_at",
//           },
//         });

//         // Assuming API returns a list of products
//         setSuggestions(data.results || data); // works if paginated or not
//         setShowDropdown(true);
//       } catch (error) {
//         console.error("Suggestion fetch error:", error);
//         setSuggestions([]);
//       }
//     };

//     const delayDebounce = setTimeout(fetchSuggestions, 300); // debounce
//     return () => clearTimeout(delayDebounce);
//   }, [keyword]);

//   Close dropdown when clicked outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (inputRef.current && !inputRef.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ✅ When user clicks a suggestion
//   const handleSuggestionClick = (suggestion) => {
//     setKeyword(suggestion.name);
//     setShowDropdown(false);
//     navigate(`/search?keyword=${suggestion.name}`);
//   };

//   // ✅ Submit form
//   const submitHandler = (e) => {
//     e.preventDefault();
//     if (keyword.trim()) {
//       navigate(`/search?keyword=${keyword}`);
//     } else {
//       navigate("/search");
//     }
//     setShowDropdown(false);
//   };

//   return (
//     <Form onSubmit={submitHandler} className="d-none d-lg-flex me-3 position-relative">
//       <FormControl
//         type="search"
//         placeholder="Search products..."
//         className="search-input"
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         onFocus={() => keyword.length > 1 && setShowDropdown(true)}
//       />
//       <Button type="submit" variant="outline-primary" className="search-btn">
//         <Search />
//       </Button>

//       {/* 🔽 Dropdown Suggestions */}
//       {showDropdown && suggestions.length > 0 && (
//         <ListGroup className="position-absolute mt-1 shadow w-100 z-3">
//           {suggestions.map((item) => (
//             <ListGroup.Item
//               key={item.id}
//               action
//               onClick={() => handleSuggestionClick(item)}
//             >
//               {item.name}
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//       )}
//     </Form>
//   );
// };

// export default SearchBox;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, Button, ListGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import axios from "axios";
import { API_URL } from "../../config/apiConfig";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // 🔎 Fetch live suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_URL}/api/search/`, {
          params: { search: keyword, ordering: "-created_at" },
        });

        setSuggestions(data.results || data); // paginated or plain list
        setShowDropdown(true);
      } catch (error) {
        console.error("Suggestion fetch error:", error);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion.name);
    setShowDropdown(false);
    navigate(`/search?keyword=${suggestion.name}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (suggestions.length > 0 && keyword.trim() === suggestions[0].name) {
      // already exact match
      navigate(`/search?keyword=${keyword}`);
    } else if (suggestions.length > 0) {
      // autocomplete with first suggestion
      navigate(`/search?keyword=${suggestions[0].name}`);
    } else if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
    } else {
      navigate("/search");
    }

    setShowDropdown(false);
  };

  return (
    <Form
      onSubmit={submitHandler}
      className="d-none d-lg-flex me-3 position-relative"
      style={{ flex: 1 }}
    >
      <FormControl
        type="search"
        placeholder="Search products..."
        className="search-input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => keyword.length > 1 && setShowDropdown(true)}
      />
      <Button type="submit" variant="" className="search-btn">
        <Search />
      </Button>

      {showDropdown && suggestions.length > 0 && (
        <ListGroup
          className="shadow w-100"
          style={{
            position: "absolute",
            top: "100%", // 👈 ensures dropdown starts below the input
            left: 0,
            zIndex: 1050,
          }}
        >
          {suggestions.map((item) => (
            <ListGroup.Item
              key={item.id}
              action
              onClick={() => handleSuggestionClick(item)}
            >
              {item.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Form>
  );
};

export default SearchBox;
