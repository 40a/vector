import React from 'react';

import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import InstallationCommand from '@site/src/components/InstallationCommand';
import Jump from '@site/src/components/Jump';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import MDXComponents from '@theme/MDXComponents';
import {MDXProvider} from '@mdx-js/react';

import classnames from 'classnames';
import dateFormat from 'dateformat';
import readingTime from 'reading-time';
import styles from './styles.module.css';
import useTOCHighlight from '@theme/hooks/useTOCHighlight';

const AnchoredH2 = Heading('h2');
const AnchoredH3 = Heading('h3');

const LINK_CLASS_NAME = 'contents__link';
const ACTIVE_LINK_CLASS_NAME = 'contents__link--active';
const TOP_OFFSET = 100;

function DocTOC({headings}) {
  useTOCHighlight(LINK_CLASS_NAME, ACTIVE_LINK_CLASS_NAME, TOP_OFFSET);
  return (
    <div className="col col--2">
      <div className={styles.tableOfContents}>
        <Headings headings={headings} />
      </div>
    </div>
  );
}

/* eslint-disable jsx-a11y/control-has-associated-label */
function Headings({headings, isChild}) {
  if (!headings.length) return null;
  return (
    <ul className={isChild ? '' : 'contents contents__left-border'}>
      {headings.map(heading => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className={LINK_CLASS_NAME}
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <Headings isChild headings={heading.children} />
        </li>
      ))}
    </ul>
  );
}

function ComponentPage(props) {
  const {content: ComponentContents} = props;
  const {frontMatter, metadata} = ComponentContents;
  const {id, title} = frontMatter;
  const {date: dateString, keywords} = metadata;
  const readingStats = readingTime(ComponentContents.toString());
  const date = new Date(Date.parse(dateString));

  return (
    <Layout title="Collect Docker Logs & Send Them Anywhere" description="Collect Docker logs in minutes, for free. Quickly collect Docker logs and metrics and send them to one or more destinations.">
      <header className="hero domain-bg domain-bg--platforms">
        <div className="container">
          <div className="component-icons">
            <div className="icon panel">
              <img src="/img/logos/docker.png" alt="Docker" />
            </div>
            <a href="#" className="icon panel" title="Select a destination">
              <i className="feather icon-plus"></i>
            </a>
          </div>
          <h1>{title}</h1>
          <p>Written, with <i className="feather icon-heart"></i>, by the <Link to="/community/#team">Vector team</Link></p>
        </div>
      </header>
      <main className="container container--narrow margin-vert--xl">
        <section>
          <blockquote className="blockquote--secondary">
            <div>&quot;I just wanna, like, collect my Docker logs and grep them -- why is all of this so complicated?&quot;</div>
            <footer>— developers</footer>
          </blockquote>

          <p>
            So you want to collect your Docker logs and send them somewhere? Sounds simple! Sadly, it is not. When you account for integrating with the Docker API, parsing, enriching, buffering, batching, retrying, handling back-pressure, load shedding, and fanning-out you quickly realize this is not so easy. Fear not though! This guide will get you up and running in minutes, all without becoming a Docker logging expert.
          </p>
        </section>
        <section>
          <AnchoredH2 id="accomplish">What we'll accomplish in this guide</AnchoredH2>

          <ol className="list--checks list--lg list--semi-bold list--primary">
            <li>Collect Docker logs (the right way).</li>
            <li>Filter which containers you collect them from.</li>
            <li>Parse, structure, and enrich your logs.</li>
            <li>Send them to one or more destinations.</li>
            <li className="list--li--arrow list--li--pink">All in just a few minutes. Let's get started!</li>
          </ol>
        </section>
        <section>
          <AnchoredH2 id="guide">A step-by-step guide</AnchoredH2>

          <ol className="sections sections--h3">
            <li>
              <AnchoredH3 id="install-vector">Run a Docker container to generate logs</AnchoredH3>

              <p>
                First, let's make sure we have a Docker container generating logs. For this guide we'll use the <a href=""><code>chentex/random-logger</code> image</a>:
              </p>

              <CodeBlock className="language-bash">
                docker run -d chentex/random-logger:latest
              </CodeBlock>
            </li>

            <li>
              <AnchoredH3 id="install-vector">Verify log generation</AnchoredH3>

              <p>
                Let's make sure logs are being generated:
              </p>

              <CodeBlock className="language-bash">
                docker logs $(docker ps | grep 'chentex/random-logger' | awk)
              </CodeBlock>

              <p>
                You'll see output like:
              </p>

              <CodeBlock className="language-text">
                2020-02-04T21:22:44+0000 DEBUG first loop completed.
                2020-02-04T21:22:46+0000 ERROR something happened in this execution.
                2020-02-04T21:22:47+0000 DEBUG first loop completed.
                2020-02-04T21:22:52+0000 ERROR something happened in this execution.
                2020-02-04T21:22:56+0000 INFO takes the value and converts it to string.
                2020-02-04T21:23:01+0000 ERROR something happened in this execution.
              </CodeBlock>

              <p>
                Hooray 🎉! We have logs being generated, now let's do something with them.
              </p>
            </li>

            <li>
              <AnchoredH3 id="install-vector">Collect Your Docker Logs</AnchoredH3>

              <p>


                Vector is a modern log and metrics collector written in Rust. It's reliable, fast, and simple to setup. It comes pre-loaded with Docker integration making it easy to setup.
              </p>

              <InstallationCommand />

              <p>
                The above command will install Vector quick and easy for your operating system. Or, if you prefer, see <Link to="/">Vector's manual installation instructions</Link>
              </p> 
            </li>

            <li>
              <AnchoredH3 id="configure">Configure Vector with the Docker source to collect logs</AnchoredH3>

              <p>Create a <code>vector.toml</code> file with the following contents:</p>

              <CodeBlock className="language-toml">
{`
[sources.docker]
  type = "docker"

[sinks.output]
  type = "console"
  inputs = ["docker"]
`}
              </CodeBlock>
            </li>

            <li>
              <AnchoredH3 id="configure">Run Vector &amp; verify collection</AnchoredH3>

              <p>That's all there is to it. Let's test and verify that Docker logs are being collected.</p>

              <CodeBlock className="language-bash">
                $ vector --config=vector.toml
              </CodeBlock>

              <p>You should see output like the following:</p>

              <CodeBlock className="language-text">
                one
                two
              </CodeBlock>
            </li>

            <li>
              <AnchoredH3 id="configure">Let's make it real by adding one or more "sinks" (destinations)</AnchoredH3>

              <p>Vector sink make it easy to fan-out data to one or more destinations. Just swap out the <code>console</code> with your desired destination.</p>

              <CodeBlock className="language-toml">
{`
[sources.docker]
  type = "docker"

[sinks.output]
  type = "console"
  inputs = ["docker"]
`}
              </CodeBlock>
            </li>
          </ol>

        </section>
        <section className="markdown">
          <MDXProvider components={MDXComponents}><ComponentContents /></MDXProvider>
        </section>
        <section>
          <h2>Next steps</h2>

        </section>
        <section>
          <h2>Why Vector?</h2>

        </section>
        <section>
          <h2>Learn more &amp; get help</h2>

        </section>
      </main>
    </Layout>
  );
}

export default ComponentPage;
