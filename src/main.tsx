import React from "react";
import * as ReactDOM from "react-dom/client";
import { dbClient } from "./dbClient";
import { Database } from "./dbTypes";

ReactDOM.createRoot(document.querySelector("#root")!).render(<App />);

export default function App() {
	const [c, setC] = React.useState<
		Database["public"]["Tables"]["courses"]["Row"][]
	>([]);
	React.useEffect(() => {
		getCourses();
	}, []);
	async function getCourses() {
		const { data } = await dbClient.from("courses").select();
		setC(data!);
	}
	const c0 = c.map((course) => (
		<CourseComp course={course} key={course["id"]} />
	));
	return <>{c0}</>;
}

function CourseComp(props: {
	course: Database["public"]["Tables"]["courses"]["Row"];
}) {
	return (
		<>
			<strong>{`${props.course["subject"]} ${props.course["course_number"]} - ${props.course["title"]}`}</strong>
			<hr />
			<em>{props.course["description"]}</em>
			<br />
			<br />
			<SectionTable sections={props.course["sections"]} />
		</>
	);
}
function SectionTable(props: {
	sections: Database["public"]["Tables"]["courses"]["Row"]["sections"];
}) {
	const s = props.sections?.map((sec) => <tr>{sec}</tr>);
	return (
		<table>
			<th>Section</th>
			{s}
		</table>
	);
}
