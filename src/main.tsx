import React from "react";
import * as ReactDOM from "react-dom/client";
import { dbClient } from "./dbClient";
import { Database } from "./dbTypes";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

type mainCourse = Database["public"]["Tables"]["courses"]["Row"];

ReactDOM.createRoot(document.querySelector("#root")!).render(<App />);

export default function App() {
	const [courses, setCourses] = React.useState<mainCourse[]>([]);
	const [session, setSession] = React.useState(null);
	React.useEffect(() => {
		getAllCourses();
	}, []);
	async function getAllCourses() {
		const { data } = await dbClient.from("courses").select();
		setCourses(data!);
	}
	React.useEffect(() => {
		dbClient.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		const {
			data: { subscription },
		} = dbClient.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);
	if (!session)
		return <Auth supabaseClient={dbClient} appearance={{ theme: ThemeSupa }} />;
	async function logout() {
		await dbClient.auth.signOut();
	}

	const c = courses.map((course) => (
		<>
			<CourseComp course={course} key={course["id"]} />
		</>
	));
	return (
		<>
			<nav>
				<ul>
					<li onClick={logout}>log out.</li>
				</ul>
			</nav>
			{c}
		</>
	);
}

function CourseComp(props: { course: mainCourse }) {
	const prereqs = props.course.prerequisites
		?.toString()
		.split(/,/)
		.map((p) => <li key={p}>{p}</li>);
	const coreqs = props.course["corequisites"]
		?.toString()
		.split(/,/)
		.map((p) => (
			<li key={p}>
				<em>{p}</em>
			</li>
		));
	return (
		<div id="course-box">
			<strong>{`${props.course["subject"]} ${props.course["course_number"]} - ${props.course["title"]}`}</strong>
			<hr />
			<em>{props.course["description"]}</em>
			<br />
			<br />
			<strong>Prerequisites:</strong>
			{prereqs ? (
				<ul>{prereqs}</ul>
			) : (
				<>
					<br />
					<em>No prerequisites.</em>
					<br />
				</>
			)}
			<strong>Corequisites:</strong>
			{coreqs ? (
				<ul>{coreqs}</ul>
			) : (
				<>
					<br />
					<em>No corequisites.</em>
				</>
			)}
			<SectionTable course={props.course} />
		</div>
	);
}
function SectionTable(props: { course: mainCourse }) {
	const sections = props.course.sections?.map((section, i) => (
		<tr key={section}>
			<td>{section}</td>
			<td>{props.course["capacity"]?.at(2 * i) ?? "0"}</td>
			<td>{props.course["capacity"]?.at(2 * i + 1) ?? "0"}</td>
		</tr>
	));
	return (
		<table>
			<tr>
				<th>Section</th>
				<th>Total Seats</th>
				<th>Seats Remaining</th>
			</tr>
			{sections}
		</table>
	);
}
