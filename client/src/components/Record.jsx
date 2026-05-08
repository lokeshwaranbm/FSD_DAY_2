import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="record-page-title">Create/Update Employee Record</h3>
      <form onSubmit={onSubmit} className="record-card">
        <div className="record-card-grid">
          <div className="record-intro">
            <h2>Employee Info</h2>
            <p>
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="record-fields">
            <div className="record-field">
              <label htmlFor="name">Name</label>
              <div className="record-input-wrap">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="record-input"
                  placeholder="First Last"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
            </div>

            <div className="record-field">
              <label htmlFor="position">Position</label>
              <div className="record-input-wrap">
                <input
                  type="text"
                  name="position"
                  id="position"
                  className="record-input"
                  placeholder="Developer Advocate"
                  value={form.position}
                  onChange={(e) => updateForm({ position: e.target.value })}
                />
              </div>
            </div>

            <div className="record-options">
              <label className="record-option" htmlFor="positionIntern">
                <input
                  id="positionIntern"
                  name="positionOptions"
                  type="radio"
                  value="Intern"
                  checked={form.level === "Intern"}
                  onChange={(e) => updateForm({ level: e.target.value })}
                />
                Intern
              </label>

              <label className="record-option" htmlFor="positionJunior">
                <input
                  id="positionJunior"
                  name="positionOptions"
                  type="radio"
                  value="Junior"
                  checked={form.level === "Junior"}
                  onChange={(e) => updateForm({ level: e.target.value })}
                />
                Junior
              </label>

              <label className="record-option" htmlFor="positionSenior">
                <input
                  id="positionSenior"
                  name="positionOptions"
                  type="radio"
                  value="Senior"
                  checked={form.level === "Senior"}
                  onChange={(e) => updateForm({ level: e.target.value })}
                />
                Senior
              </label>
            </div>
          </div>
        </div>

        <div className="record-submit-row">
          <input
            type="submit"
            value="Save Employee Record"
            className="record-submit"
          />
        </div>
      </form>
    </>
  );
}
