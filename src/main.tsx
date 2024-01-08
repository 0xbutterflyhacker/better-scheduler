import React from "react";
import * as ReactDOM from "react-dom/client";
import { dbClient } from "./dbClient";
import { Database } from "./dbTypes";

type mainCourse = Database["public"]["Tables"]["courses"]["Row"];

ReactDOM.createRoot(document.querySelector("#root")!).render(<App />);

export default function App() {
	const [courses, setCourses] = React.useState<mainCourse[]>([]);
	React.useEffect(() => {
		getAllCourses();
	}, []);
	async function getAllCourses() {
		const { data } = await dbClient.from("courses").select();
		setCourses(data!);
	}
	const c = courses.map((course) => (
		<CourseComp course={course} key={course["id"]} />
	));
	return <>{c}</>;
}

function CourseComp(props: { course: mainCourse }) {
	React.useEffect(() => {
		let ignore: boolean = false;
		prereqs?.map((p) =>
			p.map(async (p0) => {
				if (!isNaN(Number(p0))) {
					const pre = await getCourse(Number(p0));
					if (pre) p0 = `${pre[0].subject} ${pre[0].course_number}`;
				}
				return p0;
			})
		);
		if (!ignore) {
			prereqs?.forEach((p) => {
				if (p.length === 1) formattedPrereqs.push(<li>{p[0]}</li>);
				else {
					let str: string = "";
					p.forEach((p0, i) => {
						if (i === p.length) str += p0;
						else str += `${p0} OR`;
					});
					formattedPrereqs.push(str);
				}
			});
		}

		return () => {
			ignore = true;
		};
	}, []);
	const prereqs = props.course.prerequisites
		?.toString()
		.split(/,/)
		.map((p) => p.split(/OR/));
	const formattedPrereqs = [];
	async function getCourse(id: number) {
		const { data } = await dbClient
			.from("courses")
			.select("subject, course_number")
			.eq("id", id);
		return data;
	}
	return (
		<div id="course-box">
			<strong>{`${props.course["subject"]} ${props.course["course_number"]} - ${props.course["title"]}`}</strong>
			<hr />
			<em>{props.course["description"]}</em>
			<br />
			<br />
			<strong>Prerequisites:</strong>
			<ul></ul>
			<SectionTable course={props.course} />
		</div>
	);
}
function SectionTable(props: { course: mainCourse }) {
	const sections = props.course.sections?.map((section) => (
		<tr key={section}>{section}</tr>
	));
	return (
		<table>
			<th>Section</th>
			<tbody>{sections}</tbody>
		</table>
	);
}
