// utils/SearchAndFilterBar.js
import { InputGroup, Form, Button, Dropdown } from "react-bootstrap";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";

const SearchAndFilterBar = ({ searchValue, onSearchChange, filters = [] }) => {
  return (
    <div className="d-flex flex-wrap gap-2 align-items-center">
      <InputGroup className="me-3" style={{ maxWidth: 300 }}>
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchValue && (
          <Button variant="outline-secondary" onClick={() => onSearchChange("")}>
            <FaTimes />
          </Button>
        )}
      </InputGroup>

      {filters.map((filter, idx) => (
        <Dropdown key={idx}>
          <Dropdown.Toggle variant="outline-secondary">
            <FaFilter className="me-2" />
            {filter.value === "all" ? `Filter by ${filter.label}` : `${filter.label}: ${filter.value}`}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {filter.options.map((opt) => (
              <Dropdown.Item
                key={opt}
                active={filter.value === opt}
                onClick={() => filter.onChange(opt)}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ))}
    </div>
  );
};

export default SearchAndFilterBar;
